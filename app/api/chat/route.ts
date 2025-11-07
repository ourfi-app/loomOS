

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateAuth, logApiRequest, createErrorResponse } from '@/lib/api-utils';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const session = await validateAuth(request);
    logApiRequest('POST', '/api/chat', { userId: session?.user?.id });

    const { message, sessionId, userContext, stream = true } = await request.json();

    if (!message || !sessionId) {
      return createErrorResponse('Message and session ID required', 400, 'VALIDATION_ERROR');
    }

    // Save user message to database
    const chatSession = await prisma.chatSession.upsert({
      where: { sessionToken: sessionId },
      update: {
        updatedAt: new Date()
      },
      create: {
        sessionToken: sessionId,
        userId: session.user.id
      }
    });

    await prisma.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'user',
        content: message
      }
    });

    // Simple system prompt for ChatLLM "just type" functionality
    const systemPrompt = `You are a helpful AI assistant for the Montrecott Condominium Association management system.

User Information:
- Name: ${userContext?.name || 'Resident'}
- Role: ${userContext?.role || 'RESIDENT'}

You can help with:
- Building rules and regulations
- Construction and renovation guidelines
- Payment information and dues
- General building policies
- Maintenance requests
- Any other community-related questions

Be friendly, professional, and helpful in your responses.`;

    // Use ChatLLM API for "just type" functionality
    const chatLLMResponse = await fetch('https://api.abacus.ai/api/v0/chatLLM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        systemMessage: systemPrompt,
        stream: stream,
        temperature: 0.7,
        maxTokens: 1500
      }),
    });

    if (!chatLLMResponse.ok) {
      throw new Error(`ChatLLM API request failed: ${chatLLMResponse.statusText}`);
    }

    if (stream) {
      // Create streaming response for real-time updates
      const streamResponse = new ReadableStream({
        async start(controller) {
          const reader = chatLLMResponse.body?.getReader();
          const decoder = new TextDecoder();
          const encoder = new TextEncoder();
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader?.read() || { done: true, value: undefined };
              if (done) break;

              const chunk = decoder.decode(value);
              controller.enqueue(encoder.encode(chunk));
              
              // Collect response content for saving
              const lines = chunk.split('\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    break;
                  }

                  try {
                    const parsed = JSON.parse(data);
                    buffer += parsed.choices?.[0]?.delta?.content || '';
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }

            // Save assistant response to database
            if (buffer.trim()) {
              await prisma.chatMessage.create({
                data: {
                  sessionId: chatSession.id,
                  role: 'assistant',
                  content: buffer.trim()
                }
              });
            }
          } catch (error) {
            console.error('Stream error:', error);
            controller.error(error);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(streamResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      const data = await chatLLMResponse.json();
      const assistantMessage = data.choices?.[0]?.message?.content || '';

      // Save assistant response to database
      if (assistantMessage.trim()) {
        await prisma.chatMessage.create({
          data: {
            sessionId: chatSession.id,
            role: 'assistant',
            content: assistantMessage.trim()
          }
        });
      }

      return NextResponse.json({
        message: assistantMessage,
        sessionId: sessionId
      });
    }

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
