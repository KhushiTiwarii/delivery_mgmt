// app/api/partners/[id]/route.ts
import { NextRequest,NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DeliveryPartner from '@/models/DeliveryPartner';

export async function GET(request: NextRequest) {
  // Extract the dynamic parameter `id` from the URL, assuming route is /api/orders/[id]/status
  const urlParts = request.nextUrl.pathname.split('/');
  const id = urlParts[urlParts.length - 1];  // Get the last part as the `id`
  console.log(id);
    await dbConnect();  // Ensure DB connection
  
    // Fetch the partner by ID from the database
    const partner = await DeliveryPartner.findById(id);
  
    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });  // If partner not found, return 404
    }
  
    return NextResponse.json(partner);  // Return the found partner
  }

export async function PUT(request: NextRequest) {
  // Extract the dynamic parameter `id` from the URL, assuming route is /api/orders/[id]/status
  const urlParts = request.nextUrl.pathname.split('/');
  const id = urlParts[urlParts.length - 1];  // Get the last part as the `id`

  await dbConnect();
  const data = await request.json();
  const partner = await DeliveryPartner.findByIdAndUpdate(id, data, { new: true });
  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }
  return NextResponse.json(partner);
}

export async function DELETE(request: NextRequest) {
   // Extract the dynamic parameter `id` from the URL, assuming route is /api/orders/[id]/status
   const urlParts = request.nextUrl.pathname.split('/');
   const id = urlParts[urlParts.length - 1];  // Get the last part as the `id`
   console.log(id);
   
  await dbConnect();
  const partner = await DeliveryPartner.findByIdAndDelete(id);
  if (!partner) {
    return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Partner deleted successfully' });
}