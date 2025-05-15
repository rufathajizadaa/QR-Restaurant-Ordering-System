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

// PATCH to mark all orders for a table as completed
export async function PATCH(request, { params }) {
  try {
    const tableId = Number.parseInt(params.tableId, 10)
    const orders = await getOrdersFile()

    // Update all orders for the specified table
    const updatedOrders = orders.map((order) => {
      if (order.tableId === tableId) {
        return {
          ...order,
          status: "completed",
        }
      }
      return order
    })

    await writeOrdersFile(updatedOrders)

    // Return only the updated orders for the table
    const tableOrders = updatedOrders.filter((order) => order.tableId === tableId)
    return NextResponse.json(tableOrders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to mark table as completed" }, { status: 500 })
  }
}
