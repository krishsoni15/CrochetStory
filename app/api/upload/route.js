import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import cloudinary from '../../../lib/cloudinary';
import { verifyToken } from '../../../lib/auth';

// Force dynamic rendering for this route (uses file system and cookies)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function isAuthenticated(request) {
  const token = request.cookies.get('adminToken')?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function POST(request) {
  try {
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check for Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary environment variables are missing');
      return NextResponse.json(
        { error: 'Server configuration error: Cloudinary credentials are missing' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('images');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileExtension = file.name.split('.').pop() || 'jpg';
      const tempPath = join(tmpdir(), `crochet-${Date.now()}-${Math.random().toString(36)}.${fileExtension}`);

      await writeFile(tempPath, buffer);

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          tempPath,
          {
            folder: 'crochetstory',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          async (error, result) => {
            await unlink(tempPath).catch(() => { });
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
      });
    });

    const urls = await Promise.all(uploadPromises);

    if (!urls || urls.length === 0) {
      return NextResponse.json(
        { error: 'No images were uploaded successfully' },
        { status: 400 }
      );
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error.message || 'Failed to upload images. Please check your Cloudinary configuration.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

