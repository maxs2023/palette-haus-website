import { NextResponse } from 'next/server';
import { getOrder } from '@/lib/database';

export async function GET(request, { params }) {
  const { orderId } = params;
  
  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const order = await getOrder(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}