import { NextResponse } from 'next/server';
import { getOrdersByCustomer } from '@/lib/database';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }
  
  try {
    const orders = await getOrdersByCustomer(email);
    
    // Filter to only show completed orders
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    return NextResponse.json({
      orders: completedOrders,
      count: completedOrders.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}