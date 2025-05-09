import { promises as fs } from "fs"
import { NextResponse } from "next/server"
import path from "path"

// Helper function to read the orders file
async function getOrdersFile() {
  const filePath = path.join(process.cwd(), "data", "orders.json")
  const data = await fs.readFile(filePath, "utf8")
  return JSON.parse(data)
}

// Helper function to write to the orders file
async function writeOrdersFile(orders) {
  const filePath = path.join(process.cwd(), "data", "orders.json")
  await fs.writeFile(filePath, JSON.stringify(orders, null, 2), "utf8")
}

// GET all orders
export async function GET() {
  try {
    const orders = await getOrdersFile()
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST a new order
export async function POST(request) {
  try {
    const orders = await getOrdersFile()
    const newOrder = await request.json()

    // Generate a unique ID
    const orderId = Date.now()

    const orderWithId = {
      ...newOrder,
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "pending",
    }

    orders.push(orderWithId)
    await writeOrdersFile(orders)

    return NextResponse.json(orderWithId, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
