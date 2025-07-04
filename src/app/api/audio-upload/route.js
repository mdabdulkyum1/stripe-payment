import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    const transcript = formData.get('transcript');

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `audio_${timestamp}.wav`;
    const filepath = path.join(uploadsDir, filename);

    // Save the file
    await writeFile(filepath, buffer);

    // Log the upload details
    console.log('Audio file uploaded:', {
      filename,
      filepath,
      size: buffer.length,
      transcript,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Audio file uploaded successfully',
      filename,
      filepath,
      size: buffer.length,
      transcript
    });

  } catch (error) {
    console.error('Error uploading audio file:', error);
    return NextResponse.json(
      { error: 'Failed to upload audio file' },
      { status: 500 }
    );
  }
} 