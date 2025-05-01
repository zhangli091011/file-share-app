import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fileStorage } from '../../storage';
import { FileInfo } from '../../../../../src/app/types';
import { randomInt } from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a 6-digit code
    const id = randomInt(100000, 999999).toString();
    const filename = `${id}-${file.name}`;
    const path = join(process.cwd(), 'uploads', filename);

    // Save file to disk
    await writeFile(path, buffer);

    // Save file info to storage
    const fileInfo: FileInfo = {
      id,
      filename,
      originalName: file.name,
      path,
      size: file.size,
      uploadDate: new Date()
    };

    fileStorage.saveFile(fileInfo);

    return NextResponse.json({ 
      success: true, 
      code: id,
      filename: file.name 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 