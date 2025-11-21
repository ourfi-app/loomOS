
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

interface WebPage {
  id: string;
  projectId: string;
  name: string;
  template: string;
  html: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/brandy/web-pages?projectId=xxx - Get all web pages for a project
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    // Get web pages from notes with special category
    const query: any = {
      where: {
        userId: session.user.id,
        category: 'brandy-web-page',
      },
      orderBy: { updatedAt: 'desc' },
    };

    if (projectId) {
      // Filter by project ID (stored in tags)
      query.where.tags = {
        has: projectId,
      };
    }

    const notes = await prisma.note.findMany(query);

    const webPages: WebPage[] = notes.map(note => {
      try {
        return JSON.parse(note.content);
      } catch {
        return null;
      }
    }).filter(Boolean);

    return NextResponse.json(webPages);
  } catch (error) {
    console.error('Error fetching web pages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/brandy/web-pages - Create or update a web page
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const webPage: WebPage = await req.json();

    // Get user's organization ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'User organization not found' }, { status: 400 });
    }

    const noteId = webPage.id.startsWith('webpage-') ? 'note-' + webPage.id : webPage.id;

    const note = await prisma.note.upsert({
      where: { id: noteId },
      update: {
        title: webPage.name,
        content: JSON.stringify(webPage),
        updatedAt: new Date(),
      },
      create: {
        id: noteId,
        organizationId: user.organizationId,
        userId: session.user.id,
        title: webPage.name,
        content: JSON.stringify(webPage),
        category: 'brandy-web-page',
        tags: [webPage.projectId],
        isFavorite: false,
        isArchived: false,
        isPinned: false,
      },
    });

    const savedPage: WebPage = JSON.parse(note.content);
    return NextResponse.json(savedPage);
  } catch (error) {
    console.error('Error saving web page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/brandy/web-pages?id=xxx - Delete a web page
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get('id');

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    const noteId = pageId.startsWith('webpage-') ? 'note-' + pageId : pageId;

    await prisma.note.delete({
      where: {
        id: noteId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting web page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
