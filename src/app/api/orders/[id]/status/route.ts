// app/api/orders/[id]/status/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import DeliveryPartner from '@/models/DeliveryPartner';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { status } = await request.json();
  const order = await Order.findById(params.id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  order.status = status;

  if (status === 'delivered') {
    const partner = await DeliveryPartner.findById(order.assignedTo);
    if (partner) {
      partner.currentLoad -= 1;
      partner.metrics.completedOrders += 1;
      await partner.save();
    }
  }

  await order.save();
  return NextResponse.json(order);
}