
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdditionalResident {
  id: string;
  unitNumber: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  isEmergencyContact: boolean;
}

interface ResidentDialogProps {
  open: boolean;
  onClose: () => void;
  unitNumber: string;
  editingResident?: AdditionalResident | null;
}

export default function ResidentDialog({ open, onClose, unitNumber, editingResident }: ResidentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'roommate',
    email: '',
    phone: '',
    isEmergencyContact: false
  });

  useEffect(() => {
    if (editingResident) {
      setFormData({
        name: editingResident.name,
        relationship: editingResident.relationship,
        email: editingResident.email || '',
        phone: editingResident.phone || '',
        isEmergencyContact: editingResident.isEmergencyContact
      });
    } else {
      setFormData({
        name: '',
        relationship: 'roommate',
        email: '',
        phone: '',
        isEmergencyContact: false
      });
    }
  }, [editingResident, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.relationship) {
      toast.error('Name and relationship are required');
      return;
    }

    setLoading(true);

    try {
      const url = editingResident 
        ? `/api/additional-residents/${editingResident.id}` 
        : '/api/additional-residents';
      const method = editingResident ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitNumber,
          ...formData
        })
      });

      if (response.ok) {
        toast.success(editingResident ? 'Resident updated successfully' : 'Resident added successfully');
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save resident');
      }
    } catch (error) {
      console.error('Error saving resident:', error);
      toast.error('Failed to save resident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingResident ? 'Edit Resident' : 'Add Resident'}</DialogTitle>
          <DialogDescription>
            {editingResident ? 'Update resident information' : 'Add a new resident to your unit'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Jane Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">
              Relationship <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.relationship || 'roommate'}
              onValueChange={(value) => setFormData({ ...formData, relationship: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roommate">Roommate</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="family">Family Member</SelectItem>
                <SelectItem value="caregiver">Caregiver</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="guest">Long-term Guest</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g., jane@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g., +1 (555) 123-4567"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isEmergencyContact"
              checked={formData.isEmergencyContact}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isEmergencyContact: checked as boolean })
              }
            />
            <Label
              htmlFor="isEmergencyContact"
              className="text-sm font-normal cursor-pointer"
            >
              Mark as emergency contact
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                editingResident ? 'Update Resident' : 'Add Resident'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
