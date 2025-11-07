'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_REGISTRY } from '@/lib/enhanced-app-registry';

interface Listing {
  id: string;
  unitNumber: string;
  listingType: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  floor?: number;
  building?: string;
  description: string;
  isActive: boolean;
}

interface Inquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  unitOfInterest?: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Amenity {
  id: string;
  name: string;
  description?: string;
  category: string;
  isAvailable: boolean;
}

export default function ResidentPortalPage() {
  const session = useSession()?.data;
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listingsRes, inquiriesRes, amenitiesRes] = await Promise.all([
        fetch('/api/resident-portal/listings'),
        fetch('/api/resident-portal/inquiries'),
        fetch('/api/resident-portal/amenities'),
      ]);

      if (listingsRes.ok) setListings(await listingsRes.json());
      if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
      if (amenitiesRes.ok) setAmenities(await amenitiesRes.json());
    } catch (error) {
      console.error('Failed to fetch portal data:', error);
      toast.error('Failed to load portal data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'sold':
      case 'rented':
        return 'bg-gray-500';
      case 'new':
        return 'bg-blue-500';
      case 'contacted':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const residentPortalApp = APP_REGISTRY['resident-portal'];

  if (loading) {
    return (
      <DesktopAppWrapper
        title={residentPortalApp?.title || 'Resident Portal'}
        icon={<Globe className="w-5 h-5" />}
        gradient={residentPortalApp?.gradient}
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </DesktopAppWrapper>
    );
  }

  return (
    <DesktopAppWrapper
      title={residentPortalApp?.title || 'Resident Portal'}
      icon={<Globe className="w-5 h-5" />}
      gradient={residentPortalApp?.gradient}
    >
      <div className="h-full overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Resident Portal</h1>
              <p className="text-muted-foreground mt-1">
                Manage your public-facing property website
              </p>
            </div>
            <Button size="sm">
              <Globe className="w-4 h-4 mr-2" />
              Visit Public Site
            </Button>
          </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Listings Tab */}
        <TabsContent value="listings" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{listings.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {listings.filter(l => l.isActive).length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">For Sale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {listings.filter(l => l.listingType === 'sale' && l.status === 'available').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">available units</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">For Rent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {listings.filter(l => l.listingType === 'rent' && l.status === 'available').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">available units</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {listings.length > 0 ? formatCurrency(
                    listings.reduce((sum, l) => sum + l.price, 0) / listings.length
                  ) : '$0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">across all listings</p>
              </CardContent>
            </Card>
          </div>

          {/* Listings Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Property Listings</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Listing
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Unit {listing.unitNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          {listing.building && `${listing.building} • `}Floor {listing.floor}
                        </p>
                      </div>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(listing.price)}
                        {listing.listingType === 'rent' && <span className="text-sm font-normal">/mo</span>}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{listing.bedrooms} bed</span>
                        <span>{listing.bathrooms} bath</span>
                        <span>{listing.squareFootage.toLocaleString()} sq ft</span>
                      </div>
                    </div>

                    <Badge variant="outline" className="capitalize">
                      For {listing.listingType}
                    </Badge>

                    <p className="text-sm line-clamp-2">{listing.description}</p>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {listings.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Home className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Listings Yet</h3>
                  <p className="text-muted-foreground mb-6 text-center">
                    Create your first property listing to attract potential residents
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Listing
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries" className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inquiries.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">New</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {inquiries.filter(i => i.status === 'new').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {inquiries.filter(i => ['contacted', 'scheduled'].includes(i.status)).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Converted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {inquiries.filter(i => i.status === 'converted').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inquiries List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>Manage prospective resident inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{inquiry.firstName} {inquiry.lastName}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {inquiry.email}
                          </span>
                          {inquiry.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {inquiry.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status}
                      </Badge>
                    </div>

                    <div className="grid gap-2 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Interest:</span>
                        <Badge variant="outline" className="capitalize">{inquiry.inquiryType}</Badge>
                        {inquiry.unitOfInterest && (
                          <span>Unit {inquiry.unitOfInterest}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        Received: {formatDate(inquiry.createdAt)}
                      </p>
                    </div>

                    <p className="text-sm mb-3 line-clamp-2">{inquiry.message}</p>

                    <div className="flex gap-2">
                      <Select defaultValue={inquiry.status}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Tour
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {inquiries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Mail className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Inquiries Yet</h3>
                  <p className="text-muted-foreground text-center">
                    Inquiries from your public portal will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Amenities Tab */}
        <TabsContent value="amenities" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Property Amenities</CardTitle>
                  <CardDescription>Showcase your building's features</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Amenity
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {amenities.map((amenity) => (
                  <Card key={amenity.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">{amenity.name}</h4>
                        {amenity.isAvailable ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <Badge variant="outline" className="mb-3 capitalize">
                        {amenity.category}
                      </Badge>
                      {amenity.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {amenity.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {amenities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Amenities Listed</h3>
                  <p className="text-muted-foreground mb-6 text-center">
                    Add amenities to showcase your building's features
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Amenity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portal Settings</CardTitle>
              <CardDescription>Configure your public website settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" placeholder="Montrecott Condominiums" />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" placeholder="info@montrecott.com" />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input id="contactPhone" type="tel" placeholder="(555) 123-4567" />
                </div>

                <div>
                  <Label htmlFor="address">Property Address</Label>
                  <Textarea id="address" placeholder="1907 Montrose Ave, Chicago, IL 60613" />
                </div>

                <div>
                  <Label htmlFor="description">Property Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your property..." 
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </DesktopAppWrapper>
  );
}
