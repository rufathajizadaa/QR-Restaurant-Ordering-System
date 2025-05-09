import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">QMenyu</h1>
        <p className="text-muted-foreground">QR Code-based Restaurant Ordering System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Access</CardTitle>
            <CardDescription>Access the menu and place orders</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/menu" className="w-full">
              <Button className="w-full" size="lg">
                Menu (Table 3)
              </Button>
            </Link>
            <Link href="/cart" className="w-full">
              <Button className="w-full" variant="outline" size="lg">
                View Cart
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Access</CardTitle>
            <CardDescription>Access for restaurant staff</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/kitchen" className="w-full">
              <Button className="w-full" variant="secondary" size="lg">
                Kitchen Staff
              </Button>
            </Link>
            <Link href="/waiter" className="w-full">
              <Button className="w-full" variant="secondary" size="lg">
                Waiter
              </Button>
            </Link>
            <Link href="/manager" className="w-full">
              <Button className="w-full" variant="secondary" size="lg">
                Manager
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
