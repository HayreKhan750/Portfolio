import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Certificate } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const certificateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issue_date: z.string().min(1, 'Issue date is required'),
  credential_id: z.string().optional(),
  credential_url: z.string().url().optional().or(z.literal('')),
  proof_url: z.string().url().optional().or(z.literal('')),
  sort_order: z.number().min(0),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

interface CertificateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: Certificate | null;
}

const CertificateFormDialog = ({ open, onOpenChange, certificate }: CertificateFormDialogProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!certificate;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  });

  useEffect(() => {
    if (certificate) {
      reset({
        name: certificate.name,
        issuer: certificate.issuer,
        issue_date: certificate.issue_date,
        credential_id: certificate.credential_id || '',
        credential_url: certificate.credential_url || '',
        proof_url: certificate.proof_url || '',
        sort_order: certificate.sort_order,
      });
    } else {
      reset({
        name: '',
        issuer: '',
        issue_date: '',
        credential_id: '',
        credential_url: '',
        proof_url: '',
        sort_order: 0,
      });
    }
  }, [certificate, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CertificateFormData) => {
      if (isEditing) {
        const { error } = await supabase.from('certificates').update(data).eq('id', certificate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('certificates').insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['certificates-count'] });
      toast.success(`Certificate ${isEditing ? 'updated' : 'created'} successfully`);
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
          <div className="space-y-2">
            <Label>Certificate Name</Label>
            <Input {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Issuer</Label>
            <Input {...register('issuer')} />
            {errors.issuer && <p className="text-sm text-red-500">{errors.issuer.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Input type="date" {...register('issue_date')} />
            {errors.issue_date && <p className="text-sm text-red-500">{errors.issue_date.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Credential ID (Optional)</Label>
            <Input {...register('credential_id')} />
          </div>

          <div className="space-y-2">
            <Label>Credential URL (External Link)</Label>
            <Input {...register('credential_url')} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label>Proof URL (Certificate Image)</Label>
            <Input {...register('proof_url')} placeholder="https://..." />
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

export default CertificateFormDialog;
