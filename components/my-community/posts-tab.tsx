'use client';

import { useEffect, useState, useMemo } from 'react';
import { PostComposer } from './post-composer';
import { PostCard } from './post-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { POST_CATEGORIES } from '@/components/community/post-category';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  isPinned: boolean;
  category?: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
    firstName?: string;
    lastName?: string;
  };
  isLikedByUser: boolean;
  likesCount: number;
  commentsCount: number;
}

export function PostsTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('recent');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/community-posts');
      const data = await response.json();

      if (data.success) {
        setPosts(data.data.posts);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load posts',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostLiked = (postId: string, isLiked: boolean, likesCount: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLikedByUser: isLiked, likesCount }
        : post
    ));
  };

  const handleCommentAdded = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, commentsCount: post.commentsCount + 1 }
        : post
    ));
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handlePostPinned = (postId: string, isPinned: boolean) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isPinned }
        : post
    ));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(post =>
      post.id === updatedPost.id
        ? updatedPost
        : post
    ));
  };

  // Filter, search, and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(post =>
        post.content.toLowerCase().includes(term) ||
        post.author.name?.toLowerCase().includes(term) ||
        post.author.email.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (filterCategory !== 'ALL') {
      result = result.filter(post => post.category === filterCategory);
    }

    // Sorting
    result.sort((a, b) => {
      // Pinned posts always first
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.likesCount - a.likesCount;
        case 'discussed':
          return b.commentsCount - a.commentsCount;
        default:
          return 0;
      }
    });

    return result;
  }, [posts, searchTerm, filterCategory, sortBy]);

  const hasActiveFilters = searchTerm || filterCategory !== 'ALL' || sortBy !== 'recent';

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('ALL');
    setSortBy('recent');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Filters and Search */}
      <div className="space-y-3">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {POST_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="discussed">Most Discussed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Button>
            <span className="text-xs text-muted-foreground">
              Showing {filteredAndSortedPosts.length} of {posts.length} posts
            </span>
          </div>
        )}
      </div>

      {filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {posts.length === 0
              ? 'No posts yet. Be the first to share something!'
              : 'No posts match your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLiked={handlePostLiked}
              onCommentAdded={handleCommentAdded}
              onDeleted={handlePostDeleted}
              onPinned={handlePostPinned}
              onUpdated={handlePostUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}
