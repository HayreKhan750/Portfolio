import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type SocialLink } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  url: z.string().url('Valid URL is required'),
  icon: z.string().optional(),
  sort_order: z.number().min(0),
});

type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

interface SocialLinkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  socialLink?: SocialLink | null;
}

const SocialLinkFormDialog = ({ open, onOpenChange, socialLink }: SocialLinkFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!socialLink;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkSchema),
  });

  useEffect(() => {
    if (socialLink) {
      reset({
        platform: socialLink.platform,
        url: socialLink.url,
        icon: socialLink.icon || '',
        sort_order: socialLink.sort_order,
      });
    } else {
      reset({
        platform: '',
        url: '',
        icon: '',
        sort_order: 0,
      });
    }
  }, [socialLink, reset]);

  const mutation = useMutation({
    mutationFn: async (data: SocialLinkFormData) => {
      if (isEditing) {
        const { error } = await supabase.from('social_links').update(data).eq('id', socialLink.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('social_links').insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast.success(`Social link ${isEditing ? 'updated' : 'created'} successfully`);
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
          <div className="space-y-2">
            <Label>Platform Name</Label>
            <Input {...register('platform')} placeholder="e.g., LinkedIn, GitHub" />
            {errors.platform && <p className="text-sm text-red-500">{errors.platform.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>URL</Label>
            <Input {...register('url')} placeholder="https://..." />
            {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Icon Name (Lucide)</Label>
            <Input {...register('icon')} placeholder="e.g., Linkedin, Github, Twitter" />
            <p className="text-xs text-gray-500">Visit lucide.dev for icon names</p>
          </div>

          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input type="number" {...register('sort_order', { valueAsNumber: true })} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-gradient-to-r from-cyan-500 to-violet-500">
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SocialLinkFormDialog;
