
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Wrench,
  Droplet,
  Zap,
  Wind,
  Flame,
  Shield,
  Phone,
  Mail,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

export default function BuildingServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      id: 1,
      name: 'HVAC Maintenance',
      category: 'Maintenance',
      provider: 'ABC Climate Control',
      phone: '(555) 123-4567',
      email: 'service@abcclimate.com',
      status: 'active',
      lastService: '2025-10-15',
      nextService: '2025-11-15',
      icon: Wind,
      color: 'blue',
    },
    {
      id: 2,
      name: 'Plumbing Services',
      category: 'Emergency',
      provider: 'QuickFix Plumbing',
      phone: '(555) 234-5678',
      email: 'emergency@quickfix.com',
      status: 'active',
      lastService: '2025-10-20',
      nextService: 'On-Call',
      icon: Droplet,
      color: 'cyan',
    },
    {
      id: 3,
      name: 'Electrical Services',
      category: 'Maintenance',
      provider: 'PowerPro Electric',
      phone: '(555) 345-6789',
      email: 'support@powerpro.com',
      status: 'active',
      lastService: '2025-09-25',
      nextService: '2025-12-25',
      icon: Zap,
      color: 'yellow',
    },
    {
      id: 4,
      name: 'Fire Safety Systems',
      category: 'Safety',
      provider: 'SafeGuard Systems',
      phone: '(555) 456-7890',
      email: 'info@safeguard.com',
      status: 'active',
      lastService: '2025-10-01',
      nextService: '2026-01-01',
      icon: Flame,
      color: 'red',
    },
    {
      id: 5,
      name: 'Security Services',
      category: 'Safety',
      provider: 'SecureWatch Inc',
      phone: '(555) 567-8901',
      email: 'security@securewatch.com',
      status: 'active',
      lastService: '2025-10-25',
      nextService: 'Ongoing',
      icon: Shield,
      color: 'green',
    },
    {
      id: 6,
      name: 'General Maintenance',
      category: 'Maintenance',
      provider: 'HandyPro Services',
      phone: '(555) 678-9012',
      email: 'work@handypro.com',
      status: 'active',
      lastService: '2025-10-28',
      nextService: 'As Needed',
      icon: Wrench,
      color: 'orange',
    },
  ];

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DesktopAppWrapper
      title="Building Services"
      icon={<Wrench className="w-5 h-5" />}
      gradient="from-orange-500 to-red-500"
      toolbar={
        <>
          <Button>
            <Phone className="h-4 w-4 mr-2" />
            Contact Service
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6">
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        {/* Emergency Services Alert */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  Emergency Services
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">
                  For urgent issues, contact the appropriate emergency service provider
                  directly. All emergency services are available 24/7.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-${service.color}-100 dark:bg-${service.color}-900/20`}>
                        <Icon className={`h-6 w-6 text-${service.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {service.provider}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`tel:${service.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {service.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${service.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {service.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last service: {service.lastService}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Next service: {service.nextService}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" size="sm">
                      Request Service
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </DesktopAppWrapper>
  );
}
