'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CommentSection } from './comment-section';
import { MemberBadge } from '@/components/community/member-badge';
import { MemberStatus } from '@/components/community/member-status';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageCircle, Pin, MoreVertical, Edit2, Trash2, X, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { hasAdminAccess } from '@/lib/auth';

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
    role?: string;
    badge?: string | null;
    status?: string | null;
  };
  isLikedByUser: boolean;
  likesCount: number;
  commentsCount: number;
}

interface PostCardProps {
  post: Post;
  onLiked: (postId: string, isLiked: boolean, likesCount: number) => void;
  onCommentAdded: (postId: string) => void;
  onDeleted?: (postId: string) => void;
  onPinned?: (postId: string, isPinned: boolean) => void;
  onUpdated?: (post: Post) => void;
}

export function PostCard({ post, onLiked, onCommentAdded, onDeleted, onPinned, onUpdated }: PostCardProps) {
  const { data: session } = useSession();
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const isAdmin = hasAdminAccess(userRole);
  const isAuthor = userId === post.author.id;
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAuthor || isAdmin;
  const canPin = isAdmin;

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

  const handlePin = async () => {
    try {
      setIsPinning(true);

      const response = await fetch(`/api/community-posts/${post.id}/pin`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        onPinned?.(post.id, data.data.isPinned);
        toast({
          title: 'Success',
          description: data.data.isPinned ? 'Post pinned' : 'Post unpinned',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update pin status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast({
        title: 'Error',
        description: 'Failed to update pin status',
        variant: 'destructive',
      });
    } finally {
      setIsPinning(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/community-posts/${post.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onDeleted?.(post.id);
        toast({
          title: 'Success',
          description: 'Post deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: data.error?.message || 'Failed to delete post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = () => {
    setEditedContent(post.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedContent(post.content);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      toast({
        title: 'Error',
        description: 'Post content cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUpdating(true);

      const response = await fetch(`/api/community-posts/${post.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          imageUrl: post.imageUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedPost = {
          ...post,
          content: editedContent,
        };
        onUpdated?.(updatedPost);
        setIsEditing(false);
        toast({
          title: 'Success',
          description: 'Post updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: data.error?.message || 'Failed to update post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.image} alt={authorName} />
                  <AvatarFallback>{authorInitials}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <MemberStatus status={post.author.status as any} size="sm" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{authorName}</p>
                  <MemberBadge badge={post.author.badge as any} role={post.author.role} />
                </div>
                <p className="text-sm text-muted-foreground">{timeAgo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {post.isPinned && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  Pinned
                </Badge>
              )}
              {(canEdit || canDelete || canPin) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canPin && (
                      <DropdownMenuItem onClick={handlePin} disabled={isPinning}>
                        <Pin className="mr-2 h-4 w-4" />
                        {post.isPinned ? 'Unpin post' : 'Pin post'}
                      </DropdownMenuItem>
                    )}
                    {canEdit && (
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit post
                      </DropdownMenuItem>
                    )}
                    {(canPin || canEdit) && canDelete && <DropdownMenuSeparator />}
                    {canDelete && (
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete post
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] resize-none"
                placeholder="What's on your mind?"
                disabled={isUpdating}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isUpdating || !editedContent.trim()}
                >
                  {isUpdating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="mt-4 rounded-lg max-w-full h-auto"
                />
              )}
            </>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this post
              and all its comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
