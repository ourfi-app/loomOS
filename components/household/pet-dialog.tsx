
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Pet {
  id: string;
  unitNumber: string;
  name: string;
  type: string;
  breed?: string;
  color?: string;
  weight?: string;
  age?: string;
  description?: string;
}

interface PetDialogProps {
  open: boolean;
  onClose: () => void;
  unitNumber: string;
  editingPet?: Pet | null;
}

export default function PetDialog({ open, onClose, unitNumber, editingPet }: PetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    color: '',
    weight: '',
    age: '',
    description: ''
  });

  useEffect(() => {
    if (editingPet) {
      setFormData({
        name: editingPet.name,
        type: editingPet.type,
        breed: editingPet.breed || '',
        color: editingPet.color || '',
        weight: editingPet.weight || '',
        age: editingPet.age || '',
        description: editingPet.description || ''
      });
    } else {
      setFormData({
        name: '',
        type: 'dog',
        breed: '',
        color: '',
        weight: '',
        age: '',
        description: ''
      });
    }
  }, [editingPet, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast.error('Name and type are required');
      return;
    }

    setLoading(true);

    try {
      const url = editingPet ? `/api/pets/${editingPet.id}` : '/api/pets';
      const method = editingPet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitNumber,
          ...formData
        })
      });

      if (response.ok) {
        toast.success(editingPet ? 'Pet updated successfully' : 'Pet added successfully');
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save pet');
      }
    } catch (error) {
      console.error('Error saving pet:', error);
      toast.error('Failed to save pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingPet ? 'Edit Pet' : 'Add Pet'}</DialogTitle>
          <DialogDescription>
            {editingPet ? 'Update pet information' : 'Add a new pet to your unit'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Pet Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Max"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type || 'dog'}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="reptile">Reptile</SelectItem>
                  <SelectItem value="rabbit">Rabbit</SelectItem>
                  <SelectItem value="hamster">Hamster</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="e.g., Golden Retriever"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g., Golden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., 3 years"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g., 50 lbs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Any additional information about your pet..."
              rows={3}
            />
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
                editingPet ? 'Update Pet' : 'Add Pet'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
