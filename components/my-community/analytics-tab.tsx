'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MemberBadge } from '@/components/community/member-badge';
import { PostCategoryBadge } from '@/components/community/post-category';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  Activity,
  BarChart3,
  Award,
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalPosts: number;
    totalMembers: number;
    activeMembers: number;
    totalComments: number;
    totalLikes: number;
  };
  engagement: {
    avgLikesPerPost: number;
    avgCommentsPerPost: number;
    postsPerDay: number;
    engagementRate: number;
  };
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: string;
  }>;
  topContributors: Array<{
    userId: string;
    name: string;
    email: string;
    image?: string;
    badge?: string;
    role?: string;
    postCount: number;
  }>;
  badgeDistribution: Array<{
    badge: string;
    count: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
}

export function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community/analytics');
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load analytics',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.engagement.postsPerDay} per day (avg)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.activeMembers} active (30d)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.engagement.avgLikesPerPost} per post (avg)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.engagement.engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.engagement.avgCommentsPerPost} comments per post
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Posts by Category
            </CardTitle>
            <CardDescription>Distribution of posts across categories</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No posts yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.categoryBreakdown.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <PostCategoryBadge category={cat.category} />
                      <span className="font-medium">
                        {cat.count} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Contributors
            </CardTitle>
            <CardDescription>Members with the most posts</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topContributors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No contributors yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topContributors.slice(0, 5).map((contributor, index) => {
                  const initials = contributor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div key={contributor.userId} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-bold text-muted-foreground w-4">
                          #{index + 1}
                        </span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contributor.image} alt={contributor.name} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{contributor.name}</p>
                            <MemberBadge
                              badge={contributor.badge as any}
                              role={contributor.role}
                            />
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {contributor.postCount} {contributor.postCount === 1 ? 'post' : 'posts'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Member Badge Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Member Badges
            </CardTitle>
            <CardDescription>Distribution of member badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.badgeDistribution.map((badge) => {
                const percentage = analytics.overview.totalMembers > 0
                  ? ((badge.count / analytics.overview.totalMembers) * 100).toFixed(1)
                  : '0';

                return (
                  <div key={badge.badge} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">
                        {badge.badge === 'NONE' ? 'No Badge' : badge.badge.replace('_', ' ').toLowerCase()}
                      </span>
                      <span className="font-medium">
                        {badge.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Member Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Member Status
            </CardTitle>
            <CardDescription>Current member online status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.statusDistribution.map((status) => {
                const percentage = analytics.overview.totalMembers > 0
                  ? ((status.count / analytics.overview.totalMembers) * 100).toFixed(1)
                  : '0';

                const statusColors: Record<string, string> = {
                  ONLINE: 'bg-[var(--semantic-success)]',
                  AWAY: 'bg-[var(--semantic-warning)]',
                  BUSY: 'bg-[var(--semantic-error)]',
                  OFFLINE: 'bg-[var(--semantic-border-strong)]',
                };

                return (
                  <div key={status.status} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusColors[status.status]}`} />
                        <span className="capitalize">{status.status.toLowerCase()}</span>
                      </div>
                      <span className="font-medium">
                        {status.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`${statusColors[status.status]} rounded-full h-2 transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
