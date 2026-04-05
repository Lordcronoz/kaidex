import { NextRequest, NextResponse } from 'next/server';
import { sanitizeInput, validateEmail } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body._trap) return NextResponse.json({ success: true });
    const { firstName, lastName, email, message } = body;
    if (!firstName || !lastName || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    if (!validateEmail(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    console.log({ firstName, lastName, email, message });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }); }
}
