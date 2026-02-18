import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Experience } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  current: z.boolean(),
  location: z.string().optional(),
  sort_order: z.number().min(0),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Experience | null;
}

const ExperienceFormDialog = ({ open, onOpenChange, experience }: ExperienceFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!experience;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
  });

  const isCurrent = watch('current');

  useEffect(() => {
    if (experience) {
      reset({
        company: experience.company,
        position: experience.position,
        description: experience.description || '',
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        current: experience.current,
        location: experience.location || '',
        sort_order: experience.sort_order,
      });
    } else {
      reset({
        company: '',
        position: '',
        description: '',
        start_date: '',
        end_date: '',
        current: false,
        location: '',
        sort_order: 0,
      });
    }
  }, [experience, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ExperienceFormData) => {
      const payload = { ...data, end_date: data.current ? null : data.end_date };
      
      if (isEditing) {
        const { error } = await supabase.from('experience').update(payload).eq('id', experience.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('experience').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      queryClient.invalidateQueries({ queryKey: ['experience-count'] });
      toast.success(`Experience ${isEditing ? 'updated' : 'created'} successfully`);
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
          <div className="space-y-2">
            <Label>Company</Label>
            <Input {...register('company')} />
            {errors.company && <p className="text-sm text-red-500">{errors.company.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Position</Label>
            <Input {...register('position')} />
            {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register('description')} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" {...register('start_date')} />
              {errors.start_date && <p className="text-sm text-red-500">{errors.start_date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" {...register('end_date')} disabled={isCurrent} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="current" {...register('current')} className="w-4 h-4" />
            <Label htmlFor="current">Currently working here</Label>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input {...register('location')} placeholder="City, Country" />
          </div>

          <div className="space-y-2">
            <Label>Sort Order</Label>
            <Input type="number" {...register('sort_order', { valueAsNumber: true })} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-gradient-to-r from-cyan-500 to-violet-500">
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceFormDialog;
