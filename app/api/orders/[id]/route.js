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

// GET a specific order
export async function GET(request, { params }) {
  try {
    const orders = await getOrdersFile()
    const order = orders.find((o) => o.id === Number.parseInt(params.id))

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

// PATCH to update order status
export async function PATCH(request, { params }) {
  try {
    const orders = await getOrdersFile()
    const { status } = await request.json()

    const orderIndex = orders.findIndex((o) => o.id === Number.parseInt(params.id))

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update the order status
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
    }

    await writeOrdersFile(orders)

    return NextResponse.json(orders[orderIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
