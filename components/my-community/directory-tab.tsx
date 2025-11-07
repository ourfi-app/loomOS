
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RequestDirectoryUpdateDialog } from '@/components/request-directory-update-dialog';
import { useDirectoryData } from '@/hooks/use-api';
import { toastError } from '@/lib/toast-helpers';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Home,
  Shield,
  Hammer,
  Heart,
  Droplets,
  PartyPopper,
  Loader2
} from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  unitNumber: string | null;
  phone: string | null;
  image: string | null;
}

interface CommitteeMember {
  id: string;
  position: string | null;
  bio: string | null;
  user: User;
}

interface Committee {
  id: string;
  name: string;
  description: string | null;
  type: string;
  email: string | null;
  members: CommitteeMember[];
}

const committeeIcons: Record<string, any> = {
  board: Shield,
  architectural: Hammer,
  welcoming: Heart,
  water: Droplets,
  social: PartyPopper
};

export function DirectoryTab() {
  const { data: session } = useSession() || {};
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use the new directory hook
  const { committees, residents, isLoading, error } = useDirectoryData();

  // Show error toast if data fetch fails
  useEffect(() => {
    if (error) {
      toastError('Failed to load directory data');
    }
  }, [error]);

  const filteredResidents = residents.filter(resident =>
    resident.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      const parts = user.name.split(' ');
      return parts.length > 1 && parts[0] && parts[1]
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : user.name.slice(0, 2).toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {session?.user && (
        <div className="flex justify-end">
          <RequestDirectoryUpdateDialog
            user={{
              id: session.user.id,
              name: session.user.name || null,
              firstName: (session.user as any).firstName || null,
              lastName: (session.user as any).lastName || null,
              email: session.user.email || '',
              unitNumber: (session.user as any).unitNumber || null,
              phone: (session.user as any).phone || null,
            }}
          />
        </div>
      )}

      <Tabs defaultValue="committees" className="space-y-6">
        <TabsList>
          <TabsTrigger value="committees">Committees</TabsTrigger>
          <TabsTrigger value="residents">All Residents</TabsTrigger>
        </TabsList>

        <TabsContent value="committees" className="space-y-6">
          {committees.map((committee) => {
            const IconComponent = committeeIcons[committee.type] || Users;
            
            return (
              <Card key={committee.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>{committee.name}</CardTitle>
                        {committee.description && (
                          <CardDescription className="mt-1">
                            {committee.description}
                          </CardDescription>
                        )}
                        {committee.email && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <a 
                              href={`mailto:${committee.email}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {committee.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {committee.members.length === 0 ? (
                    <p className="text-gray-500 text-sm">No members assigned yet.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {committee.members.map((member: any) => (
                        <Card key={member.id} className="border-gray-200">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={member.user.image || undefined} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {getInitials(member.user)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">
                                  {member.user.name || `${member.user.firstName} ${member.user.lastName}`}
                                </h4>
                                {member.position && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    {member.position}
                                  </Badge>
                                )}
                                {member.user.unitNumber && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                                    <Home className="h-3 w-3" />
                                    <span>Unit {member.user.unitNumber}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                                  <Mail className="h-3 w-3" />
                                  <a 
                                    href={`mailto:${member.user.email}`}
                                    className="hover:text-blue-600 transition-colors truncate"
                                  >
                                    {member.user.email}
                                  </a>
                                </div>
                                {member.user.phone && (
                                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                                    <Phone className="h-3 w-3" />
                                    <a 
                                      href={`tel:${member.user.phone}`}
                                      className="hover:text-blue-600 transition-colors"
                                    >
                                      {member.user.phone}
                                    </a>
                                  </div>
                                )}
                                {member.bio && (
                                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                    {member.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {committees.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No committees have been set up yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="residents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Owners Directory</CardTitle>
              <CardDescription>
                All active residents in the community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or unit number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {filteredResidents.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? 'No residents found matching your search.' : 'No residents found.'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResidents.map((resident) => (
                    <Card key={resident.id} className="border-gray-200">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={resident.image || undefined} />
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {getInitials(resident)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {resident.name || `${resident.firstName} ${resident.lastName}`}
                            </h4>
                            {resident.unitNumber && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                                <Home className="h-3 w-3" />
                                <span>Unit {resident.unitNumber}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                              <Mail className="h-3 w-3" />
                              <a 
                                href={`mailto:${resident.email}`}
                                className="hover:text-blue-600 transition-colors truncate"
                              >
                                {resident.email}
                              </a>
                            </div>
                            {resident.phone && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                                <Phone className="h-3 w-3" />
                                <a 
                                  href={`tel:${resident.phone}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {resident.phone}
                                </a>
                              </div>
                            )}
                          </div>
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
    </div>
  );
}
