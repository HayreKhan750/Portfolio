import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type SocialLink } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import SocialLinkFormDialog from './SocialLinkFormDialog';
import * as LucideIcons from 'lucide-react';

const SocialLinksTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const queryClient = useQueryClient();

  const { data: socialLinks = [] } = useQuery({
    queryKey: ['social-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      toast.success('Social link deleted successfully');
    },
  });

  const getIconComponent = (iconName?: string) => {
    if (!iconName) return <LinkIcon className="w-5 h-5" />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <LinkIcon className="w-6 h-6 text-cyan-400" />
          Social Links ({socialLinks.length})
        </h2>
        <Button
          onClick={() => {
            setEditingLink(null);
            setIsDialogOpen(true);
          }}
          className="bg-gradient-to-r from-cyan-500 to-violet-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {socialLinks.map((link) => (
          <div key={link.id} className="glass-card rounded-xl p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                {getIconComponent(link.icon)}
              </div>
              <div>
                <h3 className="font-bold text-white">{link.platform}</h3>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {link.url}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setEditingLink(link);
                  setIsDialogOpen(true);
                }}
                className="hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (confirm('Are you sure?')) deleteMutation.mutate(link.id);
                }}
                className="hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {socialLinks.length === 0 && (
          <div className="col-span-full glass-card rounded-xl p-12 text-center">
            <LinkIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No social links yet.</p>
          </div>
        )}
      </div>

      <SocialLinkFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        socialLink={editingLink}
      />
    </div>
  );
};

export default SocialLinksTab;
