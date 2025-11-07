
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  UserCircle, 
  Users, 
  CreditCard, 
  Home
} from 'lucide-react';
import ProfileTab from '@/components/my-household/profile-tab';
import HouseholdTab from '@/components/my-household/household-tab';
import PaymentsTab from '@/components/my-household/payments-tab';
import {
  WebOSNavigationPane
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';

export default function MyHouseholdPage() {
  const session = useSession()?.data;
  const [activeSection, setActiveSection] = useState<'profile' | 'household' | 'payments'>('profile');

  // @ts-ignore
  const userUnitNumber = session?.user?.unitNumber;

  const navItems = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <UserCircle className="h-5 w-5" />,
      active: activeSection === 'profile',
      onClick: () => setActiveSection('profile')
    },
    { 
      id: 'household', 
      label: 'Household', 
      icon: <Users className="h-5 w-5" />,
      active: activeSection === 'household',
      onClick: () => setActiveSection('household')
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: <CreditCard className="h-5 w-5" />,
      active: activeSection === 'payments',
      onClick: () => setActiveSection('payments')
    },
  ];

  return (
    <div className="h-full flex overflow-hidden">
        <WebOSNavigationPane
          title="My Household"
          items={navItems}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {userUnitNumber && (
            <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-b border-gray-200">
              <Home className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-sm text-gray-700">Unit {userUnitNumber}</span>
            </div>
          )}
          <div className="flex-1 bg-white overflow-y-auto p-6">
            {activeSection === 'profile' && <ProfileTab />}
            {activeSection === 'household' && <HouseholdTab />}
            {activeSection === 'payments' && <PaymentsTab />}
          </div>
        </div>
    </div>
  );
}
