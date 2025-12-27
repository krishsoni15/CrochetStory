import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { verifyToken } from '../../../lib/auth';

// Force dynamic rendering for this route (uses database)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function isAuthenticated(request) {
  const token = request.cookies.get('adminToken')?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
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

    await dbConnect();

    const body = await request.json();
    const { name, description, price, category, images, offer } = body;

    // Validate all required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }
    
    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: 'Product description is required' },
        { status: 400 }
      );
    }
    
    if (!price || isNaN(price) || Number(price) <= 0) {
      return NextResponse.json(
        { error: 'Valid price is required (must be greater than 0)' },
        { status: 400 }
      );
    }
    
    if (!category || !category.trim()) {
      return NextResponse.json(
        { error: 'Product category is required' },
        { status: 400 }
      );
    }
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      images: images.filter(img => img && img.trim()), // Filter out empty images
      offer: (offer !== undefined && offer !== null && offer !== '') ? Math.min(Math.max(Number(offer), 0), 100) : 0, // Clamp between 0-100
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle duplicate key errors or validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: `Validation error: ${error.message}` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

