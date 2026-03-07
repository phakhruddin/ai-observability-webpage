import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Send, Minimize2, Maximize2 } from "lucide-react";

/**
 * Live Chat Widget Component
 * Provides real-time support and engagement for website visitors
 * Design: Floating widget with minimizable chat interface
 */

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
  avatar?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    text: "👋 Hi there! Welcome to OpsNexAI. How can I help you today?",
    sender: "agent",
    timestamp: new Date(),
    avatar: "🤖",
  },
  {
    id: "2",
    text: "Feel free to ask about our features, pricing, or schedule a demo!",
    sender: "agent",
    timestamp: new Date(Date.now() + 1000),
    avatar: "🤖",
  },
];

const QUICK_REPLIES = [
  "Tell me about features",
  "Pricing information",
  "Schedule a demo",
  "Contact sales",
];

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate agent response after a delay
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(messageText),
        sender: "agent",
        timestamp: new Date(),
        avatar: "🤖",
      };
      setMessages((prev) => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const getAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("feature")) {
      return "Great question! OpsNexAI offers real-time tracing, multi-agent orchestration, PII masking, error detection, and performance analytics. Would you like to know more about any specific feature?";
    }
    if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return "We offer flexible pricing starting at $299/month for startups. Enterprise plans are available with custom pricing. Visit our pricing section or I can connect you with our sales team!";
    }
    if (lowerMessage.includes("demo")) {
      return "I'd love to show you OpsNexAI in action! You can schedule a demo with our team at your convenience. Would you like me to connect you with a sales representative?";
    }
    if (lowerMessage.includes("contact") || lowerMessage.includes("sales")) {
      return "You can reach our sales team at info@opsnexai.com or call (425) 202-5790. They're available Monday-Friday, 9am-6pm PT. Or I can take your information and have them reach out!";
    }
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hi! 👋 Great to connect with you. What can I help you with today? Feel free to ask about our platform, pricing, or anything else!";
    }

    return "Thanks for your message! That's a great question. For more detailed information, I'd recommend checking out our documentation or connecting with our sales team. What else can I help with?";
  };

  return (
    <>
      {/* Chat Widget */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isOpen ? "w-96" : "w-auto"
        }`}
      >
        {isOpen && !isMinimized && (
          <div className="bg-card border border-border rounded-lg shadow-lg flex flex-col h-96 mb-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h3 className="font-semibold text-foreground">OpsNexAI Support</h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-secondary"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-xs ${
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {message.avatar && (
                      <div className="text-xl flex-shrink-0">{message.avatar}</div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center">
                    <div className="text-xl">🤖</div>
                    <div className="bg-secondary text-foreground px-4 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="border-t border-border px-4 py-3 bg-background">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">
                  Quick replies:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleSendMessage(reply)}
                      className="text-xs px-3 py-2 bg-secondary hover:bg-accent/10 text-foreground rounded border border-border hover:border-accent transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border px-4 py-3 bg-card flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
              />
              <Button
                size="icon"
                className="bg-accent text-accent-foreground hover:opacity-90"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isMinimized && (
          <div className="mb-4 bg-card border border-border rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              OpsNexAI Support
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-secondary"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Toggle Button */}
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full bg-accent text-accent-foreground hover:opacity-90 rounded-full shadow-lg flex items-center justify-center gap-2 py-6"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Chat with us</span>
          </Button>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
