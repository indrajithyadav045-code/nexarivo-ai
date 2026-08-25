import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Copy, Loader, Pencil, Plus, RotateCcw, Search, Send, Trash2, X } from "lucide-react";
function SimpleMarkdown({ content }: { content: string }) {
  return <div className="space-y-2 whitespace-pre-wrap">{content.split("\n").map((line, index) => {
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const text = heading ? heading[2] : line;
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("`") && part.endsWith("`")) return <code key={partIndex} className="rounded bg-muted px-1 py-0.5 text-xs">{part.slice(1, -1)}</code>;
      return <span key={partIndex}>{part}</span>;
    });
    return heading ? <p key={index} className="font-semibold text-base">{parts}</p> : <p key={index}>{parts}</p>;
  })}</div>;
}
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: Date;
  updatedAt: Date;
  dbId?: number;
}

const models = [
  { id: "nexarivo-lite", name: "NEXARIVO Lite", provider: "NEXARIVO", icon: "✨", tier: "free" },
  { id: "nexarivo-pro", name: "NEXARIVO Pro", provider: "NEXARIVO", icon: "⚡", tier: "starter" },
  { id: "nexarivo-ultra", name: "NEXARIVO Ultra", provider: "NEXARIVO", icon: "🚀", tier: "professional" },
  { id: "gpt-3.5", name: "GPT-3.5 Turbo", provider: "OpenAI", icon: "🔵", tier: "starter" },
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", icon: "🔵", tier: "professional" },
  { id: "claude-sonnet", name: "Claude Sonnet", provider: "Anthropic", icon: "🟠", tier: "starter" },
  { id: "claude-opus", name: "Claude Opus", provider: "Anthropic", icon: "🟠", tier: "professional" },
];

const tierRank: Record<string, number> = { free: 0, starter: 1, professional: 2, enterprise: 3 };

export default function Chat() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "# Welcome to NEXARIVO-AI\n\nHello! I'm your AI assistant powered by Claude and ChatGPT. I can help you with:\n\n- **Code Generation** - Write and debug code\n- **Writing** - Create content and documents\n- **Analysis** - Break down complex topics\n- **Problem Solving** - Find solutions to your challenges\n\nHow can I assist you today?",
          timestamp: new Date(),
          model: "nexarivo-lite",
        },
      ],
      model: "nexarivo-lite",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [currentChatId, setCurrentChatId] = useState("1");
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("nexarivo-lite");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [historySearch, setHistorySearch] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat?.messages || [];
  const currentDbId = currentChat?.dbId ?? 0;
  const chatMutation = trpc.ai.chat.useMutation();
  const historyQuery = trpc.chatHistory.list.useQuery(undefined, { enabled: Boolean(user) });
  const messagesQuery = trpc.chatHistory.messages.useQuery(
    { conversationId: currentDbId },
    { enabled: Boolean(user && currentDbId) }
  );
  const deleteConversationMutation = trpc.chatHistory.delete.useMutation();
  const updateMessageMutation = trpc.chatHistory.updateMessage.useMutation();
  const persistedSearchQuery = trpc.chatHistory.search.useQuery(
    { query: historySearch.trim() },
    { enabled: Boolean(user && historySearch.trim().length >= 2) }
  );
  const filteredChats = useMemo(() => {
    const query = historySearch.trim().toLowerCase();
    if (!query) return chats;
    if (historySearch.trim().length >= 2 && persistedSearchQuery.data) {
      return persistedSearchQuery.data.map((chat) => ({
        id: String(chat.id),
        dbId: chat.id,
        title: chat.title,
        messages: [],
        model: chat.model,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
      }));
    }
    return chats.filter((chat) => chat.title.toLowerCase().includes(query) || chat.messages.some((message) => message.content.toLowerCase().includes(query)));
  }, [chats, historySearch, persistedSearchQuery.data]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!historyQuery.data?.length) return;
    const persistedChats: Chat[] = historyQuery.data.map((chat) => ({
      id: String(chat.id),
      dbId: chat.id,
      title: chat.title,
      messages: [],
      model: chat.model,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
    }));
    setChats(persistedChats);
    setCurrentChatId((current) => persistedChats.some((chat) => chat.id === current) ? current : persistedChats[0].id);
    setSelectedModel((current) => persistedChats.find((chat) => chat.id === current)?.model ?? current);
  }, [historyQuery.data]);

  useEffect(() => {
    if (!messagesQuery.data || !currentChat?.dbId) return;
    const persistedMessages: Message[] = messagesQuery.data.map((message) => ({
      id: String(message.id),
      role: message.role,
      content: message.content,
      timestamp: new Date(message.createdAt),
      model: message.model ?? undefined,
    }));
    setChats((prev) => prev.map((chat) => chat.dbId === currentChat.dbId ? { ...chat, messages: persistedMessages } : chat));
  }, [messagesQuery.data, currentChat?.dbId]);

  const streamAssistantMessage = async (chatId: string, assistantMessage: Message) => {
    setChats((prev) => prev.map((chat) => chat.id === chatId ? { ...chat, messages: [...chat.messages, { ...assistantMessage, content: "" }], updatedAt: new Date() } : chat));
    const words = assistantMessage.content.split(/(\s+)/);
    let content = "";
    for (const word of words) {
      content += word;
      setChats((prev) => prev.map((chat) => chat.id === chatId ? { ...chat, messages: chat.messages.map((message) => message.id === assistantMessage.id ? { ...message, content } : message) } : chat));
      await new Promise((resolve) => setTimeout(resolve, 8));
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      model: selectedModel,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              updatedAt: new Date(),
            }
          : chat
      )
    );

    const question = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatMutation.mutateAsync({
        model: selectedModel,
        messages: [
          ...messages.map((message) => ({ role: message.role, content: message.content })),
          { role: "user" as const, content: question },
        ],
        conversationId: currentChat?.dbId,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        model: response.model,
      };

      await streamAssistantMessage(currentChatId, assistantMessage);
      setChats((prev) => prev.map((chat) => chat.id === currentChatId ? { ...chat, dbId: response.conversationId ?? chat.dbId } : chat));
      void historyQuery.refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to get an answer right now. Please try again.";
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `I couldn't answer that just now. ${message}`,
                    timestamp: new Date(),
                    model: selectedModel,
                  },
                ],
                updatedAt: new Date(),
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      model: selectedModel,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleDeleteChat = async (chatId: string) => {
    setChatError(null);
    const chatToDelete = chats.find((chat) => chat.id === chatId);
    if (chatToDelete?.dbId) {
      try {
        await deleteConversationMutation.mutateAsync({ conversationId: chatToDelete.dbId });
      } catch (error) {
        console.warn("[Chat] Could not delete persisted conversation:", error);
        setChatError("This conversation could not be deleted. Please try again.");
        return;
      }
    }
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      const nextChat = chats.find((chat) => chat.id !== chatId);
      setCurrentChatId(nextChat?.id || "");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const startEditingMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditingText(message.content);
  };

  const saveEditedMessage = async () => {
    if (!editingMessageId || !editingText.trim()) return;
    const messageId = Number(editingMessageId);
    if (Number.isInteger(messageId) && messageId > 0) {
      try {
        await updateMessageMutation.mutateAsync({ messageId, content: editingText.trim() });
      } catch (error) {
        console.warn("[Chat] Could not persist edited message:", error);
        return;
      }
    }
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: chat.messages.map((message) =>
                message.id === editingMessageId ? { ...message, content: editingText.trim() } : message
              ),
              updatedAt: new Date(),
            }
          : chat
      )
    );
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleRegenerate = async (assistantMessageId: string) => {
    const messageIndex = messages.findIndex((message) => message.id === assistantMessageId);
    const previousUserMessage = messageIndex > 0 ? messages[messageIndex - 1] : undefined;
    if (!previousUserMessage || previousUserMessage.role !== "user" || isLoading) return;

    const history = messages
      .slice(0, messageIndex - 1)
      .map((message) => ({ role: message.role, content: message.content }));
    const model = messages[messageIndex]?.model ?? selectedModel;
    setIsLoading(true);
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: chat.messages.filter((message) => message.id !== assistantMessageId), updatedAt: new Date() }
          : chat
      )
    );

    try {
      const response = await chatMutation.mutateAsync({
        model,
        messages: [...history, { role: "user" as const, content: previousUserMessage.content }],
        conversationId: currentChat?.dbId,
      });
      await streamAssistantMessage(currentChatId, { id: Date.now().toString(), role: "assistant", content: response.content, timestamp: new Date(), model: response.model });
      setChats((prev) => prev.map((chat) => chat.id === currentChatId ? { ...chat, dbId: response.conversationId ?? chat.dbId } : chat));
      void historyQuery.refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to regenerate this answer.";
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, { id: Date.now().toString(), role: "assistant", content: `I couldn't regenerate that answer. ${message}`, timestamp: new Date(), model }],
                updatedAt: new Date(),
              }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedModelInfo = models.find((m) => m.id === selectedModel);
  const userTier = user?.subscriptionTier ?? "free";
  const canAccessModel = (modelTier: string) => tierRank[modelTier] <= tierRank[userTier];
  const handleModelChange = (modelId: string) => {
    const nextModel = models.find((model) => model.id === modelId);
    if (nextModel && canAccessModel(nextModel.tier)) setSelectedModel(modelId);
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar - Chat History */}
      {showSidebar && (
        <div className="w-64 bg-card border-r border-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <Button
              onClick={handleNewChat}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            >
              <Plus size={18} />
              New Chat
            </Button>
          </div>

          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={historySearch}
                onChange={(event) => setHistorySearch(event.target.value)}
                placeholder="Search conversations"
                aria-label="Search conversations"
                className="h-9 pl-9 bg-background"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                  currentChatId === chat.id
                    ? "bg-accent/20 border border-accent"
                    : "hover:bg-background/50 border border-transparent"
                }`}
              >
                <p className="text-sm font-medium truncate">{chat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {chat.messages.length} messages
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  className="mt-2 w-full text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between bg-card/50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="h-8 w-8 p-0"
            >
              ☰
            </Button>
            <div>
              <h2 className="text-lg font-bold">AI Chat</h2>
              <p className="text-xs text-muted-foreground">
                {selectedModelInfo?.provider} - {selectedModelInfo?.name}
              </p>
            </div>
          </div>
        </div>

        {chatError && <div role="alert" className="mx-6 mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{chatError}</div>}

        {/* Messages Area */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Start a conversation</h3>
              <p className="text-muted-foreground max-w-md">
                Choose a model and ask anything. Your AI assistant is ready to help.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-2xl ${
                    message.role === "user"
                      ? "bg-accent text-accent-foreground rounded-2xl rounded-tr-sm px-4 py-3"
                      : "bg-card border border-border rounded-2xl rounded-tl-sm p-4"
                  }`}
                >
                  {editingMessageId === message.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") saveEditedMessage();
                          if (event.key === "Escape") setEditingMessageId(null);
                        }}
                        autoFocus
                        aria-label="Edit message"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveEditedMessage} className="h-7 gap-1"><Check size={13} /> Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingMessageId(null)} className="h-7 gap-1"><X size={13} /> Cancel</Button>
                      </div>
                    </div>
                  ) : message.role === "assistant" ? (
                    <div className="prose prose-invert max-w-none text-sm">
                      <SimpleMarkdown content={message.content} />
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.role === "user" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditingMessage(message)}
                        disabled={isLoading}
                        className="h-6 w-6 p-0 hover:bg-accent/20"
                        title="Edit message"
                      >
                        <Pencil size={14} />
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-6 w-6 p-0 hover:bg-accent/20"
                          title="Copy"
                        >
                          <Copy size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegenerate(message.id)}
                          disabled={isLoading}
                          className="h-6 w-6 p-0 hover:bg-accent/20"
                          title="Regenerate"
                        >
                          <RotateCcw size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-2 items-center">
                  <Loader size={16} className="animate-spin text-accent" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-6 bg-card/50">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  AI Model
                </label>
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id} disabled={!canAccessModel(model.tier)}>
                        <span className="flex items-center gap-2">
                          <span>{model.icon}</span>
                          {model.name} ({model.provider})
                          {!canAccessModel(model.tier) && <span className="text-xs text-muted-foreground">Requires {model.tier}</span>}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  &nbsp;
                </label>
                <Button
                  onClick={handleNewChat}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Plus size={16} />
                  New
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Input
                placeholder="Ask anything... (Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                className="flex-1 bg-background border-border"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 px-6"
              >
                {isLoading ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Powered by OpenAI & Anthropic • Your data is private and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
