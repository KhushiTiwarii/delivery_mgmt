
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Toaster, toast } from 'react-hot-toast'

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered';
  scheduledFor: string;
  assignedTo?: string;
  totalAmount: number;
}

interface DeliveryPartner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  currentLoad: number;
  areas: string[];
  shift: {
    start: string;
    end: string;
  };
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    orderNumber: '',
    customer: { name: '', phone: '', address: '' },
    area: '',
    items: [{ name: '', quantity: 1, price: 0 }],
    scheduledFor: '',
    totalAmount: 0
  })
  const [partnerDetails, setPartnerDetails] = useState<DeliveryPartner | null>(null)
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false)

  // New filter states
  const [areaFilter, setAreaFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [areaFilter, statusFilter, dateFilter])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (areaFilter) params.append('area', areaFilter)
      if (statusFilter) params.append('status', statusFilter)
      if (dateFilter) params.append('date', dateFilter)

      const response = await fetch(`/api/orders?${params.toString()}`)
      const data = await response.json()
      setOrders(data)
    } catch{
      toast.error('Failed to fetch orders')
    }
  }

  const fetchPartnerDetails = async (partnerId: string) => {
    try {
      const response = await fetch(`/api/partners/${partnerId}`)
      const data = await response.json()
      setPartnerDetails(data)
      setIsPartnerDialogOpen(true)
    } catch{
      toast.error('Failed to fetch partner details')
    }
  }

  const handleAssign = async (orderId: string) => {
    try {
      const response = await fetch('/api/orders/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })
      if (response.ok) {
        toast.success('Order assigned successfully')
        fetchOrders()
      } else {
        toast.error('Failed to assign order')
      }
    } catch{
      toast.error('Failed to assign order')
    }
  }

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedOrder) {
      try {
        const response = await fetch(`/api/orders/${selectedOrder._id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: (e.target as HTMLFormElement).status.value })
        })
        if (response.ok) {
          toast.success('Order status updated successfully')
          setIsDialogOpen(false)
          fetchOrders()
        } else {
          toast.error('Failed to update status')
        }
      } catch{
        toast.error('Failed to update status')
      }
    }
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })
      if (response.ok) {
        toast.success('Order created successfully')
        setIsCreateDialogOpen(false)
        fetchOrders()
      } else {
        toast.error('Failed to create order')
      }
    } catch{
      toast.error('Failed to create order')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Order Processing</h1>

      <Button onClick={() => setIsCreateDialogOpen(true)} className="mb-4">Create New Order</Button>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div>
          <Label htmlFor="area">Filter by Area</Label>
          <Input
            id="area"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            placeholder="Enter area"
          />
        </div>
        <div>
          <Label htmlFor="status">Filter by Status</Label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <div>
          <Label htmlFor="date">Filter by Date</Label>
          <Input
            id="date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Area</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Scheduled For</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>{order.area}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.scheduledFor}</TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                {order.status === 'pending' && (
                  <Button onClick={() => handleAssign(order._id)}>Assign</Button>
                )}
                {order.status === 'assigned' && order.assignedTo && (
                  <Button onClick={() => fetchPartnerDetails(order.assignedTo)}>View Partner</Button>
                )}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="ml-2" onClick={() => setSelectedOrder(order)}>
                      Update Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Order Status</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleStatusUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="status">New Status</Label>
                        <select id="status" name="status" className="w-full p-2 border rounded">
                          <option value="pending">Pending</option>
                          <option value="assigned">Assigned</option>
                          <option value="picked">Picked</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                      <Button type="submit">Update</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialogs and Toaster */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <div>
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                value={newOrder.orderNumber}
                onChange={(e) => setNewOrder({ ...newOrder, orderNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Customer</Label>
              <Input
                placeholder="Name"
                value={newOrder.customer.name}
                onChange={(e) => setNewOrder({
                  ...newOrder,
                  customer: { ...newOrder.customer, name: e.target.value }
                })}
                required
              />
              <Input
                placeholder="Phone"
                value={newOrder.customer.phone}
                onChange={(e) => setNewOrder({
                  ...newOrder,
                  customer: { ...newOrder.customer, phone: e.target.value }
                })}
                required
              />
              <Input
                placeholder="Address"
                value={newOrder.customer.address}
                onChange={(e) => setNewOrder({
                  ...newOrder,
                  customer: { ...newOrder.customer, address: e.target.value }
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                value={newOrder.area}
                onChange={(e) => setNewOrder({ ...newOrder, area: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="scheduledFor">Scheduled For</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={newOrder.scheduledFor}
                onChange={(e) => setNewOrder({ ...newOrder, scheduledFor: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="number"
                value={newOrder.totalAmount}
                onChange={(e) => setNewOrder({ ...newOrder, totalAmount: parseFloat(e.target.value) })}
                required
              />
            </div>
            <Button type="submit">Create Order</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delivery Partner Details</DialogTitle>
          </DialogHeader>
          {/* Render partner details here */}
          {partnerDetails && (
             <div>
               <p><strong>Name:</strong> {partnerDetails.name}</p>
               <p><strong>Email:</strong> {partnerDetails.email}</p>
               <p><strong>Phone:</strong> {partnerDetails.phone}</p>
               <p><strong>Status:</strong> {partnerDetails.status}</p>
               <p><strong>Areas:</strong> {partnerDetails.areas.join(', ')}</p>
               <p><strong>Shift:</strong> {partnerDetails.shift.start} to {partnerDetails.shift.end}</p>
               <p><strong>Metrics:</strong></p>
               <ul>
                 <li>Rating: {partnerDetails.metrics.rating}</li>
                 <li>Completed Orders: {partnerDetails.metrics.completedOrders}</li>
                 <li>Cancelled Orders: {partnerDetails.metrics.cancelledOrders}</li>
               </ul>
             </div>
           )}
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" />
    </div>
  )
}
