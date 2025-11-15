

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PawPrint, 
  Baby, 
  Users, 
  Plus, 
  Loader2,
  AlertCircle,
  Edit2,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import PetDialog from '@/components/household/pet-dialog';
import ChildDialog from '@/components/household/child-dialog';
import ResidentDialog from '@/components/household/resident-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  createdAt: string;
  updatedAt: string;
}

interface Child {
  id: string;
  unitNumber: string;
  name: string;
  age?: number;
  birthYear?: number;
  grade?: string;
  school?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdditionalResident {
  id: string;
  unitNumber: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  isEmergencyContact: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HouseholdTab() {
  const { data: session } = useSession() || {};
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<Pet[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [residents, setResidents] = useState<AdditionalResident[]>([]);
  
  const [petDialogOpen, setPetDialogOpen] = useState(false);
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [residentDialogOpen, setResidentDialogOpen] = useState(false);
  
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [editingResident, setEditingResident] = useState<AdditionalResident | null>(null);

  // @ts-ignore
  const userUnitNumber = session?.user?.unitNumber;

  useEffect(() => {
    if (userUnitNumber) {
      fetchData();
    }
  }, [userUnitNumber]);

  const fetchData = async () => {
    if (!userUnitNumber) return;
    
    setLoading(true);
    try {
      const [petsRes, childrenRes, residentsRes] = await Promise.all([
        fetch(`/api/pets?unitNumber=${userUnitNumber}`),
        fetch(`/api/children?unitNumber=${userUnitNumber}`),
        fetch(`/api/additional-residents?unitNumber=${userUnitNumber}`)
      ]);

      if (petsRes.ok) {
        const petsData = await petsRes.json();
        setPets(petsData);
      }

      if (childrenRes.ok) {
        const childrenData = await childrenRes.json();
        setChildren(childrenData);
      }

      if (residentsRes.ok) {
        const residentsData = await residentsRes.json();
        setResidents(residentsData);
      }
    } catch (error) {
      console.error('Error fetching household data:', error);
      toast.error('Failed to load household data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id: string) => {
    if (!confirm('Are you sure you want to remove this pet?')) return;

    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPets(pets.filter(p => p.id !== id));
        toast.success('Pet removed successfully');
      } else {
        toast.error('Failed to remove pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Failed to remove pet');
    }
  };

  const handleDeleteChild = async (id: string) => {
    if (!confirm('Are you sure you want to remove this child?')) return;

    try {
      const response = await fetch(`/api/children/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setChildren(children.filter(c => c.id !== id));
        toast.success('Child removed successfully');
      } else {
        toast.error('Failed to remove child');
      }
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error('Failed to remove child');
    }
  };

  const handleDeleteResident = async (id: string) => {
    if (!confirm('Are you sure you want to remove this person?')) return;

    try {
      const response = await fetch(`/api/additional-residents/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setResidents(residents.filter(r => r.id !== id));
        toast.success('Person removed successfully');
      } else {
        toast.error('Failed to remove person');
      }
    } catch (error) {
      console.error('Error deleting resident:', error);
      toast.error('Failed to remove person');
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setPetDialogOpen(true);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setChildDialogOpen(true);
  };

  const handleEditResident = (resident: AdditionalResident) => {
    setEditingResident(resident);
    setResidentDialogOpen(true);
  };

  const handlePetDialogClose = () => {
    setPetDialogOpen(false);
    setEditingPet(null);
    fetchData();
  };

  const handleChildDialogClose = () => {
    setChildDialogOpen(false);
    setEditingChild(null);
    fetchData();
  };

  const handleResidentDialogClose = () => {
    setResidentDialogOpen(false);
    setEditingResident(null);
    fetchData();
  };

  if (!userUnitNumber) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need to have a unit number assigned to manage household members.
          Please contact an administrator.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--semantic-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="pets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pets" className="flex items-center gap-2">
            <PawPrint className="h-4 w-4" />
            Pets
            {pets.length > 0 && (
              <Badge variant="secondary" className="ml-1">{pets.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="children" className="flex items-center gap-2">
            <Baby className="h-4 w-4" />
            Children
            {children.length > 0 && (
              <Badge variant="secondary" className="ml-1">{children.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="residents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Other Residents
            {residents.length > 0 && (
              <Badge variant="secondary" className="ml-1">{residents.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Pets Tab */}
        <TabsContent value="pets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pets</CardTitle>
                  <CardDescription>
                    Add and manage pets in your unit
                  </CardDescription>
                </div>
                <Button onClick={() => setPetDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pet
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pets.length === 0 ? (
                <div className="text-center py-12">
                  <PawPrint className="h-12 w-12 text-[var(--semantic-text-tertiary)] mx-auto mb-4" />
                  <p className="text-[var(--semantic-text-secondary)] mb-4">No pets added yet</p>
                  <Button onClick={() => setPetDialogOpen(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Pet
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {pets.map((pet) => (
                    <Card key={pet.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{pet.name}</h3>
                            <Badge variant="secondary" className="capitalize mt-1">
                              {pet.type}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditPet(pet)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePet(pet.id)}
                            >
                              <Trash2 className="h-4 w-4 text-[var(--semantic-error)]" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                          {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                          {pet.color && <p><strong>Color:</strong> {pet.color}</p>}
                          {pet.age && <p><strong>Age:</strong> {pet.age}</p>}
                          {pet.weight && <p><strong>Weight:</strong> {pet.weight}</p>}
                          {pet.description && (
                            <p><strong>Description:</strong> {pet.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Children Tab */}
        <TabsContent value="children" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Children</CardTitle>
                  <CardDescription>
                    Add and manage children in your unit
                  </CardDescription>
                </div>
                <Button onClick={() => setChildDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Child
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {children.length === 0 ? (
                <div className="text-center py-12">
                  <Baby className="h-12 w-12 text-[var(--semantic-text-tertiary)] mx-auto mb-4" />
                  <p className="text-[var(--semantic-text-secondary)] mb-4">No children added yet</p>
                  <Button onClick={() => setChildDialogOpen(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Child
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {children.map((child) => (
                    <Card key={child.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{child.name}</h3>
                            {child.age && (
                              <p className="text-sm text-[var(--semantic-text-secondary)] mt-1">{child.age} years old</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditChild(child)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteChild(child.id)}
                            >
                              <Trash2 className="h-4 w-4 text-[var(--semantic-error)]" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                          {child.birthYear && <p><strong>Birth Year:</strong> {child.birthYear}</p>}
                          {child.grade && <p><strong>Grade:</strong> {child.grade}</p>}
                          {child.school && <p><strong>School:</strong> {child.school}</p>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Residents Tab */}
        <TabsContent value="residents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Other Residents</CardTitle>
                  <CardDescription>
                    Add roommates, family members, caregivers, or other people in your unit
                  </CardDescription>
                </div>
                <Button onClick={() => setResidentDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resident
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {residents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-[var(--semantic-text-tertiary)] mx-auto mb-4" />
                  <p className="text-[var(--semantic-text-secondary)] mb-4">No additional residents added yet</p>
                  <Button onClick={() => setResidentDialogOpen(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resident
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {residents.map((resident) => (
                    <Card key={resident.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{resident.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="capitalize">
                                {resident.relationship}
                              </Badge>
                              {resident.isEmergencyContact && (
                                <Badge variant="destructive">Emergency Contact</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditResident(resident)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteResident(resident.id)}
                            >
                              <Trash2 className="h-4 w-4 text-[var(--semantic-error)]" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-[var(--semantic-text-secondary)]">
                          {resident.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{resident.email}</span>
                            </div>
                          )}
                          {resident.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{resident.phone}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <PetDialog
        open={petDialogOpen}
        onClose={handlePetDialogClose}
        unitNumber={userUnitNumber}
        editingPet={editingPet}
      />
      <ChildDialog
        open={childDialogOpen}
        onClose={handleChildDialogClose}
        unitNumber={userUnitNumber}
        editingChild={editingChild}
      />
      <ResidentDialog
        open={residentDialogOpen}
        onClose={handleResidentDialogClose}
        unitNumber={userUnitNumber}
        editingResident={editingResident}
      />
    </div>
  );
}

