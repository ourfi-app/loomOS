'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CommentSection } from './comment-section';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageCircle, Pin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface PostCardProps {
  post: Post;
  onLiked: (postId: string, isLiked: boolean, likesCount: number) => void;
  onCommentAdded: (postId: string) => void;
}

export function PostCard({ post, onLiked, onCommentAdded }: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  const authorName = post.author.name || 
    `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 
    post.author.email;

  const authorInitials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLike = async () => {
    try {
      setIsLiking(true);

      const response = await fetch(`/api/community-posts/${post.id}/like`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        onLiked(post.id, data.data.isLiked, data.data.likesCount);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update like',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive',
      });
    } finally {
      setIsLiking(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.image} alt={authorName} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{authorName}</p>
              <p className="text-sm text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          {post.isPinned && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Pin className="h-3 w-3" />
              Pinned
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post image"
            className="mt-4 rounded-lg max-w-full h-auto"
          />
        )}
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant={post.isLikedByUser ? 'default' : 'ghost'}
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className="gap-2"
          >
            <Heart
              className={`h-4 w-4 ${post.isLikedByUser ? 'fill-current' : ''}`}
            />
            <span>{post.likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </Button>
        </div>

        {showComments && (
          <CommentSection
            postId={post.id}
            onCommentAdded={() => onCommentAdded(post.id)}
          />
        )}
      </CardFooter>
    </Card>
  );
}
