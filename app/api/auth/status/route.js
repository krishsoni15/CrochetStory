import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

// Force dynamic rendering for this route (uses cookies)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const token = request.cookies.get('adminToken')?.value;
    
    if (!token) {
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }

    // Verify token - this will return null if token is expired or invalid
    const decoded = verifyToken(token);
    
    if (decoded) {
      // Token is valid - admin is logged in
      // Return username from decoded token
      return NextResponse.json({ 
        isAdmin: true, 
        username: decoded.username || 'Admin' 
      }, { status: 200 });
    } else {
      // Token is expired or invalid - clear it
      const response = NextResponse.json({ isAdmin: false }, { status: 200 });
      response.cookies.delete('adminToken');
      return response;
    }
  } catch (error) {
    console.error('Auth status check error:', error);
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}

