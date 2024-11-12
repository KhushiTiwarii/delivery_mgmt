// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET() {
  await dbConnect();
  const orders = await Order.find({});
  return NextResponse.json(orders);
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