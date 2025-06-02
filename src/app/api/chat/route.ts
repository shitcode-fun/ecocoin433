import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';

export async function GET() {
  const { db } = await connectToDatabase();
  const messages = await db.collection('chatMessages').find({}).sort({ createdAt: 1 }).toArray();
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const { userAddress, message } = await req.json();
  if (!userAddress || !message) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  const { db } = await connectToDatabase();
  const result = await db.collection('chatMessages').insertOne({
    userAddress,
    message,
    createdAt: new Date(),
  });
  return NextResponse.json({ success: true, id: result.insertedId });
}