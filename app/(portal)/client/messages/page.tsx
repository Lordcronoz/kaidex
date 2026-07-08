"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  senderRole: "client" | "team";
  content: string;
  time: string;
}

const messages: Message[] = [
  { id: "1", sender: "Kaidex Team", senderRole: "team", content: "Hi! We've completed the architecture review for AI Agent Fleet v2. The deliverable has been uploaded to your project.", time: "Today, 2:30 PM" },
  { id: "2", sender: "You", senderRole: "client", content: "Thanks! I'll review the diagram and get back to you by EOD tomorrow.", time: "Today, 2:45 PM" },
  { id: "3", sender: "Kaidex Team", senderRole: "team", content: "Sounds good. Also, a quick heads up — the Q3 security audit report is ready for your review in the Deliverables tab.", time: "Today, 3:10 PM" },
  { id: "4", sender: "You", senderRole: "client", content: "Perfect. Can we schedule a call to walk through the findings?", time: "Today, 3:22 PM" },
  { id: "5", sender: "Kaidex Team", senderRole: "team", content: "Absolutely. How does Thursday at 10am ET work for you?", time: "Today, 3:25 PM" },
];

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");

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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderRole === "client" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-md ${
                msg.senderRole === "client"
                  ? "bg-foreground text-background"
                  : "bg-card border border-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium opacity-70">{msg.sender}</span>
              </div>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              <p className={`text-[10px] mt-2 ${
                msg.senderRole === "client" ? "text-background/50" : "text-muted-foreground"
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
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
              // Will handle send in Phase 3 integration
              setNewMessage("");
            }
          }}
          aria-label="Message input"
        />
        <button
          className="p-2.5 bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 flex-shrink-0"
          disabled={!newMessage.trim()}
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
