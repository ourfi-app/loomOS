import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Import the client component with no SSR (ssr: false disables all server-side rendering)
const OnboardingClient = dynamic(() => import('./OnboardingClient'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  ),
});

export default function OnboardingPage() {
  return <OnboardingClient />;
}
