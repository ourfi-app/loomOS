
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Child {
  id: string;
  unitNumber: string;
  name: string;
  age?: number;
  birthYear?: number;
  grade?: string;
  school?: string;
}

interface ChildDialogProps {
  open: boolean;
  onClose: () => void;
  unitNumber: string;
  editingChild?: Child | null;
}

export default function ChildDialog({ open, onClose, unitNumber, editingChild }: ChildDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    birthYear: '',
    grade: '',
    school: ''
  });

  useEffect(() => {
    if (editingChild) {
      setFormData({
        name: editingChild.name,
        age: editingChild.age?.toString() || '',
        birthYear: editingChild.birthYear?.toString() || '',
        grade: editingChild.grade || '',
        school: editingChild.school || ''
      });
    } else {
      setFormData({
        name: '',
        age: '',
        birthYear: '',
        grade: '',
        school: ''
      });
    }
  }, [editingChild, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);

    try {
      const url = editingChild ? `/api/children/${editingChild.id}` : '/api/children';
      const method = editingChild ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitNumber,
          name: formData.name,
          age: formData.age || null,
          birthYear: formData.birthYear || null,
          grade: formData.grade || null,
          school: formData.school || null
        })
      });

      if (response.ok) {
        toast.success(editingChild ? 'Child updated successfully' : 'Child added successfully');
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save child');
      }
    } catch (error) {
      console.error('Error saving child:', error);
      toast.error('Failed to save child');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingChild ? 'Edit Child' : 'Add Child'}</DialogTitle>
          <DialogDescription>
            {editingChild ? 'Update child information' : 'Add a new child to your unit'}
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
              placeholder="e.g., John Doe"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., 10"
                min="0"
                max="18"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthYear">Birth Year</Label>
              <Input
                id="birthYear"
                type="number"
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                placeholder="e.g., 2014"
                min="1990"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="e.g., 5th Grade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Input
              id="school"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="e.g., Lincoln Elementary"
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
                editingChild ? 'Update Child' : 'Add Child'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
