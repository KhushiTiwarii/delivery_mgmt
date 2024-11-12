// app/partners/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from 'react-hot-toast'

interface Partner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
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

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
   try {
     const response = await fetch('/api/partners')
     const data = await response.json()
     setPartners(data)
   } catch{
    toast.error("Failed to fetch orders.")
   }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPartner(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPartner)
    })
    setIsDialogOpen(false)
    toast.success("Partner created successfully!")
    fetchPartners()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/partners/${id}`, { method: 'DELETE' })
    toast.success("Partner deleted")
    fetchPartners()
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4">Partner Management</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Partner</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Partner</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="areas">Areas (comma-separated)</Label>
              <Input id="areas" name="areas" onChange={(e) => setNewPartner(prev => ({ ...prev, areas: e.target.value.split(',') }))} required />
            </div>
            <div>
              <Label htmlFor="shift.start">Shift Start</Label>
              <Input id="shift.start" name="shift.start" type="time" onChange={(e) => setNewPartner(prev => ({ ...prev, shift: { ...prev.shift, start: e.target.value } }))} required />
            </div>
            <div>
              <Label htmlFor="shift.end">Shift End</Label>
              <Input id="shift.end" name="shift.end" type="time" onChange={(e) => setNewPartner(prev => ({ ...prev, shift: { ...prev.shift, end: e.target.value } }))} required />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Current Load</TableHead>
            <TableHead>Areas</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner._id}>
              <TableCell>{partner.name}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell>{partner.phone}</TableCell>
              <TableCell>{partner.status}</TableCell>
              <TableCell>{partner.currentLoad}</TableCell>
              <TableCell>{partner.areas.join(', ')}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDelete(partner._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}