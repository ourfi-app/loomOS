'use client';

import { useEffect, useState } from 'react';
import { PostComposer } from './post-composer';
import { PostCard } from './post-card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  isPinned: boolean;
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
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLiked={handlePostLiked}
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
