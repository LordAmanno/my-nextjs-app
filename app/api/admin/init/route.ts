import { NextRequest, NextResponse } from 'next/server';
import { adminUserQueries } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = adminUserQueries.findFirst();

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Create admin user with credentials from env
    const email = process.env.ADMIN_EMAIL || 'admin@aromacoffee.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    adminUserQueries.create(email, hashedPassword);

    return NextResponse.json(
      { message: 'Admin user created successfully', email },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error initializing admin:', error);
    return NextResponse.json(
      { message: 'Failed to initialize admin user' },
      { status: 500 }
    );
  }
}

