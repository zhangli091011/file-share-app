import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { fileStorage } from '../../../storage';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const fileInfo = fileStorage.getFile(params.code);
    
    if (!fileInfo) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const file = await readFile(fileInfo.path);
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileInfo.originalName}"`,
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
} 