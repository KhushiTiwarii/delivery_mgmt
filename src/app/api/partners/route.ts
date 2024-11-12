// app/api/partners/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DeliveryPartner from '@/models/DeliveryPartner';

export async function GET() {
  await dbConnect();
  const partners = await DeliveryPartner.find({});
  return NextResponse.json(partners);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const partner = new DeliveryPartner(data);
  await partner.save();
  return NextResponse.json(partner, { status: 201 });
}