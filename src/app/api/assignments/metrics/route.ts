// app/api/assignments/metrics/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Assignment from '@/models/Assignment';

export async function GET() {
  await dbConnect();
  const totalAssigned = await Assignment.countDocuments();
  const successfulAssignments = await Assignment.countDocuments({ status: 'success' });
  const successRate = totalAssigned > 0 ? (successfulAssignments / totalAssigned) * 100 : 0;

  const failureReasons = await Assignment.aggregate([
    { $match: { status: 'failed' } },
    { $group: { _id: '$reason', count: { $sum: 1 } } },
    { $project: { reason: '$_id', count: 1, _id: 0 } }
  ]);

  // Calculate average time (assuming timestamp is when the assignment was made)
  const averageTimeResult = await Assignment.aggregate([
    { $match: { status: 'success' } },
    { $group: { _id: null, averageTime: { $avg: { $subtract: ['$timestamp', '$createdAt'] } } } }
  ]);
  const averageTime = averageTimeResult.length > 0 ? averageTimeResult[0].averageTime : 0;

  return NextResponse.json({
    totalAssigned,
    successRate,
    averageTime,
    failureReasons
  });
}