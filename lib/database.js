// Simple file-based database for orders (in production, use a real database like PostgreSQL)
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
const customersPath = path.join(process.cwd(), 'data', 'customers.json');

// Initialize database files if they don't exist
function initDatabase() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(ordersPath)) {
    fs.writeFileSync(ordersPath, JSON.stringify([], null, 2));
  }
  
  if (!fs.existsSync(customersPath)) {
    fs.writeFileSync(customersPath, JSON.stringify([], null, 2));
  }
}

// Order management
export async function createOrder(orderData) {
  initDatabase();
  
  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  const newOrder = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...orderData
  };
  
  orders.push(newOrder);
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  
  return newOrder;
}

export async function getOrder(orderId) {
  initDatabase();
  
  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  return orders.find(order => order.id === orderId);
}

export async function updateOrder(orderId, updates) {
  initDatabase();
  
  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  
  return orders[orderIndex];
}

export async function getOrdersByCustomer(customerEmail) {
  initDatabase();
  
  const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
  return orders.filter(order => order.customerEmail === customerEmail);
}

// Customer management
export async function createOrUpdateCustomer(customerData) {
  initDatabase();
  
  const customers = JSON.parse(fs.readFileSync(customersPath, 'utf-8'));
  const existingIndex = customers.findIndex(c => c.email === customerData.email);
  
  if (existingIndex >= 0) {
    customers[existingIndex] = {
      ...customers[existingIndex],
      ...customerData,
      updatedAt: new Date().toISOString()
    };
  } else {
    customers.push({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...customerData
    });
  }
  
  fs.writeFileSync(customersPath, JSON.stringify(customers, null, 2));
  
  return customers[existingIndex >= 0 ? existingIndex : customers.length - 1];
}

export async function getCustomer(email) {
  initDatabase();
  
  const customers = JSON.parse(fs.readFileSync(customersPath, 'utf-8'));
  return customers.find(customer => customer.email === email);
}