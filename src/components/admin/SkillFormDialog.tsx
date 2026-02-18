import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Skill } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const skillSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  proficiency: z.number().min(0).max(100),
  sort_order: z.number().min(0),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill | null;
}

const SkillFormDialog = ({ open, onOpenChange, skill }: SkillFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!skill;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      category: '',
      name: '',
      proficiency: 0,
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (skill) {
      reset({
        category: skill.category,
        name: skill.name,
        proficiency: skill.proficiency,
        sort_order: skill.sort_order,
      });
    } else {
      reset({
        category: '',
        name: '',
        proficiency: 0,
        sort_order: 0,
      });
    }
  }, [skill, reset]);

  const mutation = useMutation({
    mutationFn: async (data: SkillFormData) => {
      if (isEditing) {
        const { error } = await supabase
          .from('skills')
          .update(data)
          .eq('id', skill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['skills-count'] });
      toast.success(`Skill ${isEditing ? 'updated' : 'created'} successfully`);
      onOpenChange(false);
      reset();
    },
    onError: () => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} skill`);
    },
  });

  const onSubmit = (data: SkillFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              {...register('category')}
              placeholder="e.g., Frontend, Backend, AI/ML"
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., React, Python, TensorFlow"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency (0-100)</Label>
            <Input
              id="proficiency"
              type="number"
              min="0"
              max="100"
              {...register('proficiency', { valueAsNumber: true })}
            />
            {errors.proficiency && (
              <p className="text-sm text-red-500">{errors.proficiency.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input
              id="sort_order"
              type="number"
              min="0"
              {...register('sort_order', { valueAsNumber: true })}
            />
            {errors.sort_order && (
              <p className="text-sm text-red-500">{errors.sort_order.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-violet-500"
            >
              {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SkillFormDialog;
