// app/page.tsx
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Delivery Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/partners">
          <Button className="w-full h-32 text-xl">Partner Management</Button>
        </Link>
        <Link href="/orders">
          <Button className="w-full h-32 text-xl">Order Processing</Button>
        </Link>
        <Link href="/assignments">
          <Button className="w-full h-32 text-xl">Assignment System</Button>
        </Link>
      </div>
    </div>
  )
}