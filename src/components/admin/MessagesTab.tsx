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

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) toast.error("Delete failed");
    else { toast.success("Deleted!"); fetch(); }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-bold">Messages</h2>
      <div className="space-y-3">
        {messages.map(m => (
          <div key={m.id} className="glass-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm">{m.name} <span className="text-muted-foreground font-normal">({m.email})</span></p>
                <p className="text-sm text-muted-foreground mt-1">{m.content}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(m.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-4">
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
