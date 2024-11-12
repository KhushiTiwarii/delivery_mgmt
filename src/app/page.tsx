// // app/page.tsx
// import Link from 'next/link'
// import { Button } from "@/components/ui/button"

// export default function Home() {
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold mb-8">Delivery Management Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <Link href="/partners">
//           <Button className="w-full h-32 text-xl">Partner Management</Button>
//         </Link>
//         <Link href="/orders">
//           <Button className="w-full h-32 text-xl">Order Processing</Button>
//         </Link>
//         <Link href="/assignments">
//           <Button className="w-full h-32 text-xl">Assignment System</Button>
//         </Link>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Package, Truck, Users } from "lucide-react"
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

interface DashboardData {
  metrics: {
    activeOrders: number;
    availablePartners: number;
    completedOrders: number;
    totalRevenue: number;
  };
  activeOrders: Array<{
    id: string;
    lat: number;
    lng: number;
  }>;
  partnerStatus: {
    active: number;
    inactive: number;
  };
  recentAssignments: Array<{
    id: string;
    orderId: string;
    partnerId: string;
    timestamp: string;
  }>;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setDashboardData(data)
    }
    fetchDashboardData()
  }, [])

  if (!dashboardData) return <div>Loading...</div>

  return (
    <>
     <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Delivery Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <Link href="/partners">
          <Button className="w-full h-16 text-xl">Partner Management</Button>
         </Link>
         <Link href="/orders">
           <Button className="w-full h-16 text-xl">Order Processing</Button>
         </Link>
         <Link href="/assignments">
           <Button className="w-full h-16 text-xl">Assignment System</Button>
         </Link>
       </div>
     </div>
     <div className="container mx-auto p-4">

      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.metrics.activeOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.metrics.availablePartners}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.metrics.completedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.metrics.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders Map */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Orders Map</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <Map orders={dashboardData.activeOrders} />
        </CardContent>
      </Card>

      {/* Partner Availability Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Partner Availability Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around">
            <div>
              <div className="text-2xl font-bold text-green-500">{dashboardData.partnerStatus.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">{dashboardData.partnerStatus.inactive}</div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assignments */}
      <Card>
  <CardHeader>
    <CardTitle>Recent Assignments</CardTitle>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2">
      {dashboardData.recentAssignments.map((assignment) => (
        <li
          key={assignment.id}
          className="flex flex-col md:flex-row md:justify-between md:items-center space-y-1 md:space-y-0 "
        >
          <span className="text-sm md:text-base">Order: {assignment.orderId}</span>
          <span className="text-sm md:text-base">Partner: {assignment.partnerId}</span>
          <span className="text-xs md:text-sm text-gray-500">{new Date(assignment.timestamp).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  </CardContent>
</Card>

    </div>
    </>
   
  )
}