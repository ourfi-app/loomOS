import { NextResponse } from 'next/server';

// This is a simple in-memory store for the palette ID
// In a real application, this would be stored in a database
let currentPaletteId = 'default';

export async function GET() {
  return NextResponse.json({ paletteId: currentPaletteId });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paletteId } = body;
    
    if (!paletteId) {
      return NextResponse.json(
        { error: 'Palette ID is required' },
        { status: 400 }
      );
    }
    
    currentPaletteId = paletteId;
    
    return NextResponse.json({ success: true, paletteId });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update palette' },
      { status: 500 }
    );
  }
}
