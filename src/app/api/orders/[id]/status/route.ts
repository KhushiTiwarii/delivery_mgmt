import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import DeliveryPartner from '@/models/DeliveryPartner';

export async function PUT(request: NextRequest) {
  // Extract the dynamic parameter `id` from the URL, assuming route is /api/orders/[id]/status
  const urlParts = request.nextUrl.pathname.split('/');
  const id = urlParts[urlParts.length - 2];  // Get the second-to-last part as the `id`


  await dbConnect();
  const { status } = await request.json();

  const order = await Order.findById(id);

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
