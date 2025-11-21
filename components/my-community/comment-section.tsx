// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Heart, Reply, Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string;
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
  repliesCount: number;
}

interface CommentSectionProps {
  postId: string;
  onCommentAdded: () => void;
}

export function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const user = session?.user as any;

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community-posts/${postId}/comments`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (content: string, parentId?: string) => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a comment',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/community-posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: content.trim(),
          parentId: parentId || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComments([...comments, data.data.comment]);
        setNewComment('');
        setReplyContent('');
        setReplyingTo(null);
        onCommentAdded();
        toast({
          title: 'Success',
          description: 'Comment added',
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to add comment',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/community-posts/${postId}/comments/${commentId}/like`,
        {
          method: 'POST',
        }
      );

      const data = await response.json();

      if (data.success) {
        setComments(comments.map(comment =>
          comment.id === commentId
            ? { ...comment, isLikedByUser: data.data.isLiked, likesCount: data.data.likesCount }
            : comment
        ));
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive',
      });
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const authorName = comment.author.name || 
      `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim() || 
      comment.author.email;

    const authorInitials = authorName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    const replies = comments.filter(c => c.parentId === comment.id);

    return (
      <div className={`${isReply ? 'ml-8' : ''}`}>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author.image} alt={authorName} />
            <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-semibold text-sm">{authorName}</p>
              <p className="text-sm mt-1">{comment.content}</p>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeComment(comment.id)}
                className="h-auto py-1 px-2 text-xs"
              >
                <Heart
                  className={`h-3 w-3 mr-1 ${comment.isLikedByUser ? 'fill-current' : ''}`}
                />
                {comment.likesCount > 0 && comment.likesCount}
              </Button>

              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="h-auto py-1 px-2 text-xs"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}

              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3 flex gap-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] resize-none text-sm"
                  disabled={isSubmitting}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitComment(replyContent, comment.id)}
                    disabled={isSubmitting || !replyContent.trim()}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const topLevelComments = comments.filter(c => !c.parentId);

  return (
    <div className="space-y-4">
      <Separator />

      <div className="space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback className="text-xs">
              {user?.name?.slice(0, 2).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex gap-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px] resize-none text-sm"
              disabled={isSubmitting}
            />
            <Button
              size="sm"
              onClick={() => handleSubmitComment(newComment)}
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {topLevelComments.length > 0 && (
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
