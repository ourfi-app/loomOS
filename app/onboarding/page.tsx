import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Import the client component with no SSR (ssr: false disables all server-side rendering)
const OnboardingClient = dynamic(() => import('./OnboardingClient'), {
  ssr: false,
  loading: () => (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--webos-app-blue)' }} />
    </div>
  ),
});

export default function OnboardingPage() {
  return <OnboardingClient />;
}
