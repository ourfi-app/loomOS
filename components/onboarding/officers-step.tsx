
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Plus, Trash2, ArrowRight, Loader2, AlertCircle, CheckCircle, Sparkles, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Officer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  unitNumber: string;
  position: string;
}

interface OfficersStepProps {
  data: any;
  onNext: (data: any) => void;
  saving: boolean;
}

const POSITIONS = [
  'President',
  'Vice President',
  'Treasurer',
  'Secretary',
  'Board Member',
];

export default function OfficersStep({
  data,
  onNext,
  saving,
}: OfficersStepProps) {
  const { toast } = useToast();
  const [officers, setOfficers] = useState<Officer[]>(
    data?.officers || [
      {
        id: '1',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        unitNumber: '',
        position: 'President',
      },
    ]
  );

  const addOfficer = () => {
    setOfficers([
      ...officers,
      {
        id: Date.now().toString(),
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        unitNumber: '',
        position: 'Board Member',
      },
    ]);
  };

  const removeOfficer = (id: string) => {
    if (officers.length > 0) {
      setOfficers(officers.filter((o) => o.id !== id));
    }
  };

  const updateOfficer = (id: string, field: keyof Officer, value: string) => {
    setOfficers(
      officers.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const isOfficerValid = (officer: Officer) => {
    return officer.firstName && officer.lastName && officer.email && officer.position &&
           /\S+@\S+\.\S+/.test(officer.email);
  };

  const handleContinue = () => {
    // Filter to only valid officers
    const validOfficers = officers.filter(isOfficerValid);

    // This step is now optional, so we can continue even with 0 officers
    onNext({ officers: validOfficers });
  };

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/20 border-0 shadow-xl backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="mb-8 relative">
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-2 -right-2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/30 mb-4 group hover:scale-110 transition-transform duration-300">
            <Shield className="h-8 w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-900 bg-clip-text text-transparent">
                Board & Officers
              </h2>
              <span className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                Optional
              </span>
            </div>
            <p className="text-gray-600 text-lg">
              Add board members now or skip and add them later from the Admin panel.
            </p>
          </div>
        </div>
      </div>

      {/* Officers List */}
      <div className="space-y-4 mb-6">
        {officers.map((officer, index) => {
          const isValid = isOfficerValid(officer);
          return (
            <div 
              key={officer.id} 
              className="group border-2 rounded-xl p-5 bg-white/80 backdrop-blur-sm border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Officer {index + 1}
                    </h3>
                    {isValid && (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span className="font-medium">Complete</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOfficer(officer.id)}
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`firstName-${officer.id}`} className="text-sm font-semibold text-gray-900 mb-2 block">
                    First Name
                  </Label>
                  <Input
                    id={`firstName-${officer.id}`}
                    value={officer.firstName}
                    onChange={(e) =>
                      updateOfficer(officer.id, 'firstName', e.target.value)
                    }
                    placeholder="John"
                    className="h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <Label htmlFor={`lastName-${officer.id}`} className="text-sm font-semibold text-gray-900 mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id={`lastName-${officer.id}`}
                    value={officer.lastName}
                    onChange={(e) =>
                      updateOfficer(officer.id, 'lastName', e.target.value)
                    }
                    placeholder="Doe"
                    className="h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <Label htmlFor={`email-${officer.id}`} className="text-sm font-semibold text-gray-900 mb-2 block">
                    Email
                  </Label>
                  <Input
                    id={`email-${officer.id}`}
                    type="email"
                    value={officer.email}
                    onChange={(e) =>
                      updateOfficer(officer.id, 'email', e.target.value)
                    }
                    placeholder="john@example.com"
                    className="h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <Label htmlFor={`position-${officer.id}`} className="text-sm font-semibold text-gray-900 mb-2 block">
                    Position
                  </Label>
                  <Select
                    value={officer.position}
                    onValueChange={(value) =>
                      updateOfficer(officer.id, 'position', value)
                    }
                  >
                    <SelectTrigger className="h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}

        <Button 
          variant="outline" 
          onClick={addOfficer} 
          className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 group"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-semibold">Add Another Officer</span>
        </Button>
      </div>

      {/* Skip Notice */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-blue-200 rounded-xl p-5 mb-6 backdrop-blur-sm">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900 mb-1">Skip This Step?</p>
            <p className="text-sm text-blue-800">
              No problem! You can add board members anytime from the Admin Dashboard → User Management section.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Action Button */}
      <div className="flex justify-end pt-6 border-t-2 border-gray-100">
        <Button 
          size="lg" 
          onClick={handleContinue} 
          disabled={saving}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 px-8 h-12 text-base font-semibold"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
