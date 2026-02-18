import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Project } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  technologies: z.string().optional(),
  project_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  featured: z.boolean(),
  sort_order: z.number().min(0),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

const ProjectFormDialog = ({ open, onOpenChange, project }: ProjectFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!project;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
      technologies: '',
      project_url: '',
      github_url: '',
      featured: false,
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description || '',
        image_url: project.image_url || '',
        technologies: project.technologies?.join(', ') || '',
        project_url: project.project_url || '',
        github_url: project.github_url || '',
        featured: project.featured,
        sort_order: project.sort_order,
      });
    } else {
      reset({
        title: '',
        description: '',
        image_url: '',
        technologies: '',
        project_url: '',
        github_url: '',
        featured: false,
        sort_order: 0,
      });
    }
  }, [project, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const payload = {
        ...data,
        technologies: data.technologies
          ? data.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      if (isEditing) {
        const { error } = await supabase.from('projects').update(payload).eq('id', project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-count'] });
      toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully`);
      onOpenChange(false);
      reset();
    },
    onError: () => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} project`);
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" {...register('image_url')} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              {...register('technologies')}
              placeholder="React, TypeScript, Tailwind CSS"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_url">Project URL</Label>
            <Input id="project_url" {...register('project_url')} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input id="github_url" {...register('github_url')} placeholder="https://github.com/..." />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4" />
            <Label htmlFor="featured">Featured Project</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort Order</Label>
            <Input id="sort_order" type="number" {...register('sort_order', { valueAsNumber: true })} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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

export default ProjectFormDialog;
