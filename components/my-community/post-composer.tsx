'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, Image as ImageIcon } from 'lucide-react';

interface PostComposerProps {
  onPostCreated: (post: any) => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const user = session?.user as any;
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some content',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/community-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setContent('');
        onPostCreated(data.data.post);
        toast({
          title: 'Success',
          description: 'Your post has been published',
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image} alt={user?.name} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share something with your community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {/* Future: Add image upload button here */}
                {/* <Button variant="ghost" size="sm" disabled>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </Button> */}
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter (Cmd+Enter on Mac) to post
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
