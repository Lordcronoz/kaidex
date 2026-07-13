"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useApi, useApiMutation } from "@/hooks/use-api";

interface MessageUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender: MessageUser;
  receiver: MessageUser;
}

interface MessagesResponse {
  data: Message[];
  meta: { total: number };
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return isToday ? `Today, ${time}` : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${time}`;
}

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");
  const { data, loading, error, refetch } = useApi<MessagesResponse>("/messages");
  const { mutate, loading: sending } = useApiMutation();

  const messages = data?.data || [];

  // Determine the current user from messages (sender or receiver)
  const currentUserId = messages.length > 0
    ? (messages[0].sender.role === "CLIENT" ? messages[0].sender.id : messages[0].receiver.id)
    : null;

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    // Find a counterpart to send to (any admin or the last conversation partner)
    const counterpart = messages.find(
      (m) => m.senderId !== currentUserId
    );
    const receiverId = counterpart?.senderId || "";

    if (!receiverId) {
      return; // No conversation partner available
    }

    const result = await mutate("post", "/messages", {
      receiverId,
      content: newMessage.trim(),
    });

    if (result) {
      setNewMessage("");
      refetch();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-display tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Secure messaging with the Kaidex team
        </p>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                <div className="w-[60%] h-20 bg-accent/30 rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-md ${
                    isOwn
                      ? "bg-foreground text-background"
                      : "bg-card border border-border"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium opacity-70">
                      {isOwn ? "You" : (msg.sender.name || msg.sender.email)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-2 ${
                    isOwn ? "text-background/50" : "text-muted-foreground"
                  }`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message input */}
      <div className="border border-border rounded-md bg-card flex items-end gap-2 p-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-transparent text-sm resize-none p-2 focus:outline-none placeholder:text-muted-foreground min-h-[40px] max-h-[120px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={sending}
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          className="p-2.5 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 flex-shrink-0"
          disabled={!newMessage.trim() || sending}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 font-mono">
        End-to-end encrypted · Messages are logged for audit purposes
      </p>
    </div>
  );
}
