
'use client';

import { Card } from '@/components/ui/card';
import { Megaphone, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AnnouncementsWidget() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await fetch('/api/announcements?limit=3');
        if (response.ok) {
          const data = await response.json();
          setAnnouncements(data.announcements || []);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <Card className="p-4 animate-pulse">
        <div className="h-32 bg-muted rounded" />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold">Announcements</h3>
        </div>
        <button 
          onClick={() => router.push('/dashboard/notifications')}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">No announcements at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement: any) => (
            <div 
              key={announcement.id}
              className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              onClick={() => router.push(`/dashboard/notifications/${announcement.id}`)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm line-clamp-1">
                    {announcement.title}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {announcement.message}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(announcement.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
