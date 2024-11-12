// app/api/partners/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DeliveryPartner from '@/models/DeliveryPartner';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await request.json();
  const partner = await DeliveryPartner.findByIdAndUpdate(params.id, data, { new: true });
  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }
  return NextResponse.json(partner);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const partner = await DeliveryPartner.findByIdAndDelete(params.id);
  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Partner deleted successfully' });
}