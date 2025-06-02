import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userAddress = url.searchParams.get('userAddress');
  const { db } = await connectToDatabase();

  if (userAddress === 'all') {
    const completions = await db.collection('taskCompletions').find({}).toArray();
    const agg: Record<string, number> = {};
    completions.forEach((c: any) => {
      agg[c.userAddress] = (agg[c.userAddress] || 0) + 1;
    });
    const leaderboard = Object.entries(agg)
      .map(([userAddress, count]) => ({ userAddress, count }))
      .sort((a, b) => b.count - a.count);
    return NextResponse.json(leaderboard);
  }

  if (!userAddress) {
    return NextResponse.json({ error: 'Missing userAddress' }, { status: 400 });
  }
  const completions = await db.collection('taskCompletions').find({ userAddress }).toArray();
  return NextResponse.json(completions);
}

export async function POST(req: Request) {
  const { userAddress, taskId } = await req.json();
  if (!userAddress || !taskId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  const { db } = await connectToDatabase();
  const result = await db.collection('taskCompletions').insertOne({
    userAddress,
    taskId,
    completedAt: new Date(),
  });
  return NextResponse.json({ success: true, id: result.insertedId });
}