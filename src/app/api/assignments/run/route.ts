// app/api/assignments/run/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import DeliveryPartner from '@/models/DeliveryPartner';
import Assignment from '@/models/Assignment';

export async function POST() {
  await dbConnect();

  const pendingOrders = await Order.find({ status: 'pending' }).sort({ scheduledFor: 1 });
  const results = [];

  for (const order of pendingOrders) {
    const availablePartner = await DeliveryPartner.findOne({
      status: 'active',
      currentLoad: { $lt: 3 },
      areas: order.area
    }).sort({ currentLoad: 1 });

    if (availablePartner) {
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

      results.push({ orderId: order._id, status: 'assigned', partnerId: availablePartner._id });
    } else {
      const assignment = new Assignment({
        orderId: order._id,
        partnerId: null,
        status: 'failed',
        reason: 'No available partner'
      });
      await assignment.save();

      results.push({ orderId: order._id, status: 'failed', reason: 'No available partner' });
    }
  }

  return NextResponse.json(results);
}