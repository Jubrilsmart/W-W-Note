"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Trash2, Maximize2, Heart } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

interface AIChatModalProps {
  user?: unknown | null;
  noteContent?: string;
}

function getUserName(user: unknown): string | null {
  if (typeof user === "object" && user !== null && "name" in user) {
    const maybeName = (user as { name?: string | null }).name;
    return maybeName ?? null;
  }

  return null;
}

export default function AIChatModal({ user, noteContent: _noteContent = "" }: AIChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const userName = getUserName(user);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: userQuery,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/AI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuery
        }),
      });

      const data = await response.json();

      if (data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "model",
            text: data.text,
          },
        ]);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: `<p class="text-red-500 font-medium">⚠️ Connection failed. Could not process your request.</p>`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation session?")) {
      setMessages([]);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm font-medium hover:scale-[1.01] transition-transform">
          <Sparkles className="h-4 w-4 text-purple-400 fill-purple-400" />
          Ask AI Assistant
        </Button>
      </DialogTrigger>

      {/* 
        FIX APPLIED HERE: 
        - sm:max-w-none breaks the internal shadcn 425px grid barrier
        - md:max-w-4xl, lg:max-w-5xl, and xl:max-w-6xl enforce the responsive widescreen expansion
      */}
      <DialogContent className="w-full sm:max-w-none md:max-w-4xl lg:max-w-5xl xl:max-w-6xl h-[85vh] flex flex-col p-6 gap-0 bg-background border rounded-xl shadow-2xl transition-all duration-200">

        {/* Header Block */}
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b shrink-0">
          <div className="space-y-0.5">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Creative Studio {userName ? `• ${userName}` : ""}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Analyzing current note with Gemini LLM processing.
            </p>
          </div>

          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="text-muted-foreground hover:text-destructive h-9 w-9 mr-6"
              title="Clear active timeline thread"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </DialogHeader>

        {/* Scrollable Chat History Content Display Area */}
        <div className="flex-1 overflow-y-auto space-y-6 my-4 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 min-h-0">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <div className="p-4 rounded-full bg-primary/10 mb-3">
                <Heart className="h-8 w-8 text-primary opacity-80" />
              </div>
              <p className="text-base font-semibold text-foreground">Your Expansive AI Workspace</p>
              <p className="text-sm max-w-xl mt-1 leading-relaxed">
                Ask questions about your notes, build tables, or generate Multiple Choice Questions.
              </p>
            </div>
          )}

          {/* Chat Bubble Rendering Block */}
          {messages.map((msg) => {
            const sanitizedHTML = msg.role === "model" ? DOMPurify.sanitize(msg.text) : "";

            return (
              <div
                key={msg.id}
                className={`flex flex-col rounded-xl p-4 text-sm shadow-sm transition-all ${msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto rounded-tr-none max-w-[75%]"
                  : "bg-card text-card-foreground border mr-auto rounded-tl-none w-full"
                  }`}
              >
                <div className="flex items-center gap-2 mb-2 border-b border-border/40 pb-1 shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                    {msg.role === "user" ? "User Account" : "Gemini AI Core"}
                  </span>
                </div>

                {/* Render User Plaintext */}
                {msg.role === "user" && (
                  <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                )}

                {/* Render AI Raw Formatted Sanitized HTML */}
                {msg.role === "model" && (
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none transition-opacity duration-200
                      prose-headings:font-bold prose-headings:text-foreground prose-h3:text-base prose-h3:mt-3 prose-h3:mb-1
                      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-3 last:prose-p:mb-0
                      prose-ul:my-2 prose-li:my-0.5 prose-code:text-primary dark:prose-code:text-purple-300
                      prose-pre:bg-zinc-950 dark:prose-pre:bg-black prose-pre:text-zinc-100 prose-pre:p-4 prose-pre:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                  />
                )}
              </div>
            );
          })}

          {/* Loading Animation */}
          {isLoading && (
            <div className="bg-card border text-muted-foreground mr-auto rounded-xl rounded-tl-none p-4 shadow-sm flex items-center justify-center gap-1.5 w-[70px]">
              <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 bg-primary/70 rounded-full animate-bounce"></span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Toolbar Footer */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t pt-4 shrink-0 mt-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompts here, Lovie..."
            disabled={isLoading}
            className="flex-1 min-w-0 h-12 px-4 rounded-xl border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-inner"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-12 w-12 rounded-xl shrink-0 shadow-md">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send prompt execution request</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
