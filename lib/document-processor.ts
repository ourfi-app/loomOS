
import { prisma } from '@/lib/db';

export interface ProcessedDocument {
  id: string;
  filename: string;
  category: string;
  chunks: Array<{
    content: string;
    chunkIndex: number;
    metadata?: any;
  }>;
}

/**
 * Process document content and split into chunks for RAG
 */
export async function processDocumentContent(
  content: string,
  documentId: string,
  options: {
    chunkSize?: number;
    overlap?: number;
  } = {}
): Promise<void> {
  const { chunkSize = 1000, overlap = 200 } = options;

  // Split content into chunks with overlap
  const chunks: Array<{ content: string; chunkIndex: number }> = [];
  
  // Simple sentence-aware chunking
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    
    if ((currentChunk + trimmedSentence).length > chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push({
        content: currentChunk.trim(),
        chunkIndex: chunkIndex++
      });
      
      // Start new chunk with overlap
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 5)); // Approximate overlap
      currentChunk = overlapWords.join(' ') + ' ' + trimmedSentence;
    } else {
      currentChunk += ' ' + trimmedSentence;
    }
  }
  
  // Save last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex: chunkIndex
    });
  }

  // Save chunks to database
  await Promise.all(
    chunks.map(chunk =>
      prisma.documentChunk.create({
        data: {
          documentId,
          content: chunk.content,
          chunkIndex: chunk.chunkIndex,
          metadata: {
            length: chunk.content.length
          }
        }
      })
    )
  );

  // Update document status
  await prisma.document.update({
    where: { id: documentId },
    data: {
      status: 'completed',
      processedAt: new Date()
    }
  });
}

/**
 * Search for relevant document chunks using keyword matching
 * This is a simple implementation - can be enhanced with vector embeddings
 */
export async function searchDocumentChunks(
  query: string,
  options: {
    limit?: number;
    categories?: string[];
  } = {}
): Promise<Array<{ chunk: any; relevance: number }>> {
  const { limit = 5, categories } = options;

  // Get all chunks (with optional category filter)
  const documents = await prisma.document.findMany({
    where: categories ? {
      category: { in: categories }
    } : undefined,
    include: {
      chunks: true
    }
  });

  // Flatten chunks with document metadata
  const allChunks = documents.flatMap(doc =>
    doc.chunks.map(chunk => ({
      ...chunk,
      documentName: doc.originalName,
      category: doc.category
    }))
  );

  // Calculate relevance scores using keyword matching
  const queryWords = query.toLowerCase().split(/\s+/);
  
  const rankedChunks = allChunks.map(chunk => {
    const chunkText = chunk.content.toLowerCase();
    
    // Count keyword matches
    let score = 0;
    for (const word of queryWords) {
      if (word.length < 3) continue; // Skip very short words
      const matches = (chunkText.match(new RegExp(word, 'g')) || []).length;
      score += matches * (word.length / 5); // Weight by word length
    }
    
    // Bonus for exact phrase match
    if (chunkText.includes(query.toLowerCase())) {
      score += 10;
    }
    
    return {
      chunk,
      relevance: score
    };
  });

  // Filter and sort by relevance
  return rankedChunks
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

/**
 * Get category from filename
 */
export function getCategoryFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  
  if (lower.includes('rule') || lower.includes('regulation')) {
    return 'rules';
  } else if (lower.includes('construction') || lower.includes('renovation')) {
    return 'construction';
  } else if (lower.includes('sale') || lower.includes('selling')) {
    return 'sales';
  } else if (lower.includes('lease') || lower.includes('leasing') || lower.includes('rent')) {
    return 'leasing';
  } else if (lower.includes('bylaw')) {
    return 'bylaws';
  } else if (lower.includes('minute')) {
    return 'minutes';
  }
  
  return 'general';
}
