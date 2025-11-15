
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { PropertyUnit } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Plus, Save, X, Search, Building2, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_COLORS } from '@/lib/app-design-system';
import type { MapboxMapRef } from '@/components/maps/MapboxMap';

// Dynamically import Mapbox component to reduce initial bundle size (~500 KB saved)
const MapboxMap = dynamic(() => import('@/components/maps/MapboxMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-[var(--semantic-surface-hover)] rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

export default function PropertyMapPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const mapRef = useRef<MapboxMapRef>(null);
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<PropertyUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState<Partial<PropertyUnit>>({
    unitNumber: '',
    building: '',
    floor: undefined,
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: undefined,
    longitude: undefined,
    squareFootage: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    parkingSpaces: 0,
    storageUnit: '',
    occupancyStatus: 'occupied',
    monthlyDues: undefined,
    notes: '',
    isActive: true,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    // Filter units based on search term
    if (searchTerm) {
      const filtered = units.filter(unit =>
        unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.building?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.streetAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUnits(filtered);
    } else {
      setFilteredUnits(units);
    }
  }, [searchTerm, units]);

  const fetchUnits = async () => {
    try {
      const response = await fetch('/api/admin/property-units');
      const data = await response.json();
      setUnits(data.units || []);
      setFilteredUnits(data.units || []);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast.error('Failed to load property units');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (lngLat: { lng: number; lat: number }) => {
    if (isAddMode) {
      setFormData(prev => ({
        ...prev,
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      }));
      toast.success('Location selected! Fill in the unit details.');
    }
  };

  const handleUnitClick = (unit: PropertyUnit) => {
    setSelectedUnit(unit);
    setFormData(unit);
    setIsAddMode(false);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setIsAddMode(true);
    setSelectedUnit(null);
    setFormData({
      unitNumber: '',
      building: '',
      floor: undefined,
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: undefined,
      longitude: undefined,
      squareFootage: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      parkingSpaces: 0,
      storageUnit: '',
      occupancyStatus: 'occupied',
      monthlyDues: undefined,
      notes: '',
      isActive: true,
    });
    setIsDialogOpen(true);
    toast('Click on the map to set the unit location', {
      icon: '📍',
    });
  };

  const handleSave = async () => {
    if (!formData.unitNumber) {
      toast.error('Unit number is required');
      return;
    }

    try {
      const url = selectedUnit
        ? `/api/admin/property-units/${selectedUnit.id}`
        : '/api/admin/property-units';
      
      const method = selectedUnit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save unit');
      }

      toast.success(selectedUnit ? 'Unit updated successfully' : 'Unit added successfully');
      setIsDialogOpen(false);
      setIsAddMode(false);
      fetchUnits();
    } catch (error) {
      console.error('Error saving unit:', error);
      toast.error('Failed to save unit');
    }
  };

  const handleGeocode = async () => {
    if (!formData.streetAddress || !formData.city || !formData.state) {
      toast.error('Please enter street address, city, and state for geocoding');
      return;
    }

    const address = `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode || ''}`;
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
      'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        // Fly to the geocoded location
        if (mapRef.current) {
          mapRef.current.flyTo([lng, lat], 17);
        }

        toast.success('Location found!');
      } else {
        toast.error('Address not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to geocode address');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DesktopAppWrapper
      title="Property Map"
      icon={<MapPin className="w-5 h-5" />}
      gradient={APP_COLORS.admin.light}
    >
      <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nordic-night mb-2">Property Map</h1>
          <p className="text-muted-foreground">Visualize and manage unit locations</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Unit
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Search Units</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by unit number, building, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--semantic-success)]"></span>
                Occupied
              </div>
            </Badge>
            <Badge variant="secondary" className="px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                Vacant
              </div>
            </Badge>
            <Badge variant="secondary" className="px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--semantic-error)]"></span>
                Rented
              </div>
            </Badge>
            <Badge variant="secondary" className="px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--semantic-error)]"></span>
                For Sale
              </div>
            </Badge>
          </div>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden">
        <MapboxMap
          ref={mapRef}
          units={filteredUnits}
          onUnitClick={handleUnitClick}
          onMapClick={handleMapClick}
          isAddMode={isAddMode}
          height="600px"
        />
      </Card>

      {/* Units List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Units ({filteredUnits.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map(unit => (
            <Card
              key={unit.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleUnitClick(unit)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Unit {unit.unitNumber}</span>
                </div>
                <Badge variant={unit.occupancyStatus === 'occupied' ? 'default' : 'secondary'}>
                  {unit.occupancyStatus?.replace('_', ' ')}
                </Badge>
              </div>
              {unit.building && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {unit.building}
                </p>
              )}
              {unit.streetAddress && (
                <p className="text-sm text-muted-foreground mt-1">{unit.streetAddress}</p>
              )}
              {unit.latitude && unit.longitude ? (
                <div className="flex items-center gap-1 mt-2 text-xs text-[var(--semantic-success)]">
                  <MapPin className="h-3 w-3" />
                  Mapped
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                  <MapPin className="h-3 w-3" />
                  No location
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isAddMode ? 'Add New Unit' : `Edit Unit ${selectedUnit?.unitNumber}`}
            </DialogTitle>
            <DialogDescription>
              {isAddMode 
                ? 'Click on the map to set the location, then fill in the details below.'
                : 'Update the unit information and location.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unitNumber">Unit Number *</Label>
                <Input
                  id="unitNumber"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                  placeholder="101"
                />
              </div>
              <div>
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  value={formData.building}
                  onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                  placeholder="Building A"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  type="number"
                  value={formData.floor || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, floor: parseInt(e.target.value) || undefined }))}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="occupancyStatus">Occupancy Status</Label>
                <Select
                  value={formData.occupancyStatus}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, occupancyStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="vacant">Vacant</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="for_sale">For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                value={formData.streetAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, streetAddress: e.target.value }))}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="New York"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="NY"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="10001"
                />
              </div>
            </div>

            <Button variant="outline" onClick={handleGeocode} className="w-full gap-2">
              <MapPin className="h-4 w-4" />
              Geocode Address
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || undefined }))}
                  placeholder="40.7128"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || undefined }))}
                  placeholder="-74.0060"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="squareFootage">Sq. Ft.</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, squareFootage: parseInt(e.target.value) || undefined }))}
                  placeholder="1200"
                />
              </div>
              <div>
                <Label htmlFor="bedrooms">Beds</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || undefined }))}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Baths</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) || undefined }))}
                  placeholder="2.5"
                />
              </div>
              <div>
                <Label htmlFor="parkingSpaces">Parking</Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  value={formData.parkingSpaces || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, parkingSpaces: parseInt(e.target.value) || 0 }))}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storageUnit">Storage Unit</Label>
                <Input
                  id="storageUnit"
                  value={formData.storageUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, storageUnit: e.target.value }))}
                  placeholder="S-101"
                />
              </div>
              <div>
                <Label htmlFor="monthlyDues">Monthly Dues</Label>
                <Input
                  id="monthlyDues"
                  type="number"
                  step="0.01"
                  value={formData.monthlyDues || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyDues: parseFloat(e.target.value) || undefined }))}
                  placeholder="500.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional information..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Unit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    </DesktopAppWrapper>  );
}
