// api/dashboard/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import DeliveryPartner from '@/models/DeliveryPartner';
import Assignment from '@/models/Assignment';
import { geocodeAddressORS } from '@/lib/geoCode';

export async function GET() {
  await dbConnect();

  // Fetch metrics
  const activeOrders = await Order.countDocuments({ status: { $in: ['pending', 'assigned', 'picked'] } });
  const availablePartners = await DeliveryPartner.countDocuments({ status: 'active', currentLoad: { $lt: 3 } });
  const completedOrders = await Order.countDocuments({ status: 'delivered' });
  const totalRevenue = await Order.aggregate([
    { $match: { status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  // Fetch active orders and geocode addresses for map
  const activeOrdersData = await Order.find(
    { status: { $in: ['pending', 'assigned', 'picked'] } },
    'customer.address area'
  ).limit(50);

  const activeOrdersForMap = await Promise.all(
    activeOrdersData.map(async (order) => {
      const coords = await geocodeAddressORS(order.area);
      return coords
        ? { id: order._id.toString(), lat: coords.lat, lng: coords.lng }
        : null;
    })
  );

  // Filter out any orders that couldn't be geocoded
  const filteredActiveOrdersForMap = activeOrdersForMap.filter(Boolean);

  // Fetch partner status
  const partnerStatus = await DeliveryPartner.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  // Fetch recent assignments
  const recentAssignments = await Assignment.find()
    .sort({ timestamp: -1 })
    .limit(5)
    .populate('orderId', 'orderNumber')
    .populate('partnerId', 'name');

  const dashboardData = {
    metrics: {
      activeOrders,
      availablePartners,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    activeOrders: filteredActiveOrdersForMap,
    partnerStatus: {
      active: partnerStatus.find((status) => status._id === 'active')?.count || 0,
      inactive: partnerStatus.find((status) => status._id === 'inactive')?.count || 0,
    },
    recentAssignments: recentAssignments.map((assignment) => ({
      id: assignment._id.toString(),
      orderId: (assignment.orderId as any).orderNumber,
      partnerId: assignment.partnerId ? (assignment.partnerId as any).name : null,
      timestamp: assignment.timestamp,
    })),
  };

  return NextResponse.json(dashboardData);
}
