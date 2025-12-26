import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Admin from '../../../../models/Admin';
import { comparePassword, generateToken } from '../../../../lib/auth';

// Force dynamic rendering for this route (uses cookies)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await dbConnect();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, admin.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token with 30-day expiration
    const token = generateToken({ id: admin._id, username: admin.username });

    const response = NextResponse.json(
      { message: 'Login successful. Session will last for 30 days.' },
      { status: 200 }
    );

    // Set cookie for 30 days (30 * 24 * 60 * 60 seconds)
    // This creates a persistent session - admin won't need to login again for 30 days
    const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
    
    response.cookies.set('adminToken', token, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: thirtyDaysInSeconds, // 30 days
      path: '/', // Available site-wide
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

