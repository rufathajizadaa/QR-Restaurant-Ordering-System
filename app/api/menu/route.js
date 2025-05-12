import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    // Make the request to the Spring backend
    const response = await axios.get("http://localhost:8080/api/menu-items", {
      headers: {
        Accept: "application/json",
      },
    })

    // Return the data from the backend
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching menu items from backend:", error)

    // Return a more detailed error for debugging
    return NextResponse.json(
      {
        error: "Failed to fetch menu items",
        details: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
      },
      { status: 500 },
    )
  }
}
