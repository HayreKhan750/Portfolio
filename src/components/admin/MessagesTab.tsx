import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
}

const MessagesTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetchMessages(); }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">Messages ({messages.length})</h2>
      <div className="space-y-3">
        {messages.map(m => (
          <div key={m.id} className="glass-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm">{m.name}</span>
                  <span className="text-xs text-muted-foreground">{m.email}</span>
                  <span className="text-xs text-muted-foreground/50 ml-auto shrink-0">{timeAgo(m.created_at)}</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{m.content}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-destructive transition-all shrink-0 mt-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
      </div>
    </div>
  );
};

export default MessagesTab;
