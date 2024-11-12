import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import DeliveryPartner from '@/models/DeliveryPartner';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  await dbConnect();
  const { status } = await request.json();
  const order = await Order.findById(context.params.id);

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
  
  // If status is 'pending', unassign the delivery partner and reduce their current load
  if (status === 'pending') {
    if (order.assignedTo) {
      const partner = await DeliveryPartner.findById(order.assignedTo);
      if (partner) {
        partner.currentLoad -= 1;
        await partner.save();
      }
    }
    order.assignedTo = null; // Unassign the delivery partner
  }

  await order.save();
  return NextResponse.json(order);
}
