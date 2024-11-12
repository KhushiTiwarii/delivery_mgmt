// app/api/orders/assign/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import DeliveryPartner from '@/models/DeliveryPartner';
import Assignment from '@/models/Assignment';

export async function POST(request: Request) {
  await dbConnect();
  const { orderId } = await request.json();

  const order = await Order.findById(orderId);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // Simple assignment algorithm (can be improved)
  const availablePartner = await DeliveryPartner.findOne({
    status: 'active',
    currentLoad: { $lt: 3 },
    areas: order.area
  }).sort({ currentLoad: 1 });

  if (!availablePartner) {
    const assignment = new Assignment({
      orderId: order._id,
      partnerId: null,
      status: 'failed',
      reason: 'No available partner'
    });
    await assignment.save();
    return NextResponse.json({ error: 'No available partner' }, { status: 400 });
  }

  order.status = 'assigned';
  order.assignedTo = availablePartner._id;
  await order.save();

  availablePartner.currentLoad += 1;
  await availablePartner.save();

  const assignment = new Assignment({
    orderId: order._id,
    partnerId: availablePartner._id,
    status: 'success'
  });
  await assignment.save();

  return NextResponse.json({ message: 'Order assigned successfully', partnerId: availablePartner._id });
}