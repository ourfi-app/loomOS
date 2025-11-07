'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { POST_CATEGORIES } from '@/components/community/post-category';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, Image as ImageIcon, X } from 'lucide-react';

interface PostComposerProps {
  onPostCreated: (post: any) => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const user = session?.user as any;
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'Error',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/community-posts/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.data.imageUrl;
      } else {
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        });
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

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

      // Upload image first if exists
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (imageFile && !imageUrl) {
          // Image upload failed
          setIsSubmitting(false);
          return;
        }
      }

      const response = await fetch('/api/community-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl,
          category,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContent('');
        setCategory('GENERAL');
        handleRemoveImage();
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

            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || !!imageFile}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {imageFile ? 'Image added' : 'Add image'}
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploadingImage ? 'Uploading...' : 'Posting...'}
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
