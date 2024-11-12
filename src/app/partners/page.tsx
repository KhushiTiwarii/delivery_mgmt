
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
  const [currentPartner, setCurrentPartner] = useState<Partial<Partner> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners')
      const data = await response.json()
      setPartners(data)
    } catch {
      toast.error("Failed to fetch partners.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentPartner(prev => prev ? { ...prev, [name]: value } : null)
  }

  const openEditDialog = (partner: Partner) => {
    setCurrentPartner(partner)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isEditMode && currentPartner?._id) {
      // Update existing partner
      await fetch(`/api/partners/${currentPartner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPartner)
      })
      toast.success("Partner updated successfully!")
    } else {
      // Create new partner
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPartner)
      })
      toast.success("Partner created successfully!")
    }
    setIsDialogOpen(false)
    fetchPartners()
    setIsEditMode(false)
    setCurrentPartner(null)
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
          <Button className="mb-4" onClick={() => { setCurrentPartner({}); setIsEditMode(false) }}>Add New Partner</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Partner" : "Add New Partner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={currentPartner?.name || ''} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={currentPartner?.email || ''} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={currentPartner?.phone || ''} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="areas">Areas (comma-separated)</Label>
              <Input id="areas" name="areas" value={currentPartner?.areas?.join(', ') || ''} onChange={(e) => setCurrentPartner(prev => prev ? { ...prev, areas: e.target.value.split(',') } : null)} required />
            </div>
            <div>
              <Label htmlFor="shift.start">Shift Start</Label>
              <Input id="shift.start" name="shift.start" type="time" value={currentPartner?.shift?.start || ''} onChange={(e) => setCurrentPartner(prev => prev ? { ...prev, shift: { start: e.target.value, end: prev.shift?.end || '' } } : null)} required />
            </div>
            <div>
              <Label htmlFor="shift.end">Shift End</Label>
              <Input id="shift.end" name="shift.end" type="time" value={currentPartner?.shift?.end || ''} onChange={(e) => setCurrentPartner(prev => prev ? { ...prev, shift: { start: prev.shift?.start || '', end: e.target.value } } : null)} required />
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
                <Button onClick={() => openEditDialog(partner)} className='mb-1 md:mb-0 md:mr-1'>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(partner._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
