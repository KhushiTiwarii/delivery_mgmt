// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(request: Request) {
  await dbConnect();
  const url = new URL(request.url);
  
  const area = url.searchParams.get('area');
  const status = url.searchParams.get('status');
  const date = url.searchParams.get('date'); // Expecting date in 'YYYY-MM-DD' format

  const filter: any = {};

  if (area) filter.area = area;
  if (status) filter.status = status;
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1); // Include the entire day
    filter.scheduledFor = { $gte: start, $lt: end };
  }

  try {
    const orders = await Order.find(filter);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}


export async function POST(request: Request) {
    await dbConnect();
    try {
      const data = await request.json();
  
      // Validate required fields
      if (!data.orderNumber || !data.customer || !data.area || !data.items || !data.scheduledFor || !data.totalAmount) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      // Create the order
      const newOrder = new Order(data);
      await newOrder.save();
  
      return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
      console.error('Order creation error:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
  }