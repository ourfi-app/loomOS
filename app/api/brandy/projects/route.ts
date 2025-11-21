
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

interface LogoProject {
  id: string;
  name: string;
  businessName: string;
  tagline?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fontSize: number;
  fontFamily: string;
  iconType?: 'circle' | 'square' | 'star' | 'custom';
  backgroundColor: string;
  createdAt: string;
  updatedAt: string;
}

// GET /api/brandy/projects - Get all logo projects for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, we'll use the Notes table as a storage mechanism
    // In production, you'd create a dedicated LogoProjects table
    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        category: 'brandy-logo-project',
      },
      orderBy: { updatedAt: 'desc' },
    });

    const projects: LogoProject[] = notes.map(note => {
      try {
        return JSON.parse(note.content);
      } catch {
        return null;
      }
    }).filter(Boolean);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching logo projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/brandy/projects - Create or update a logo project
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project: LogoProject = await req.json();

    // Store as a note with special category
    // Get user's organization ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { organizationId: true },
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: 'User organization not found' }, { status: 400 });
    }

    const note = await prisma.note.upsert({
      where: {
        id: project.id.startsWith('project-') ? 'note-' + project.id : project.id,
      },
      update: {
        title: project.name,
        content: JSON.stringify(project),
        updatedAt: new Date(),
      },
      create: {
        id: project.id.startsWith('project-') ? 'note-' + project.id : project.id,
        organizationId: user.organizationId,
        userId: session.user.id,
        title: project.name,
        content: JSON.stringify(project),
        category: 'brandy-logo-project',
        isFavorite: false,
        isArchived: false,
        isPinned: false,
      },
    });

    const savedProject: LogoProject = JSON.parse(note.content);
    return NextResponse.json(savedProject);
  } catch (error) {
    console.error('Error saving logo project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/brandy/projects?id=xxx - Delete a logo project
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const noteId = projectId.startsWith('project-') ? 'note-' + projectId : projectId;

    await prisma.note.delete({
      where: {
        id: noteId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting logo project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
