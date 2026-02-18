import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to Supabase error_logs — fire and forget
    const logError = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await supabase.from("error_logs").insert({
          user_id: session?.user?.id || null,
          error_message: error.message || "Unknown error",
          stack_trace: (error.stack || "") + "\n\nComponent Stack:" + (info.componentStack || ""),
          page_url: window.location.href,
        });
      } catch {
        // Silently fail — don't cause more errors while handling one
      }
    };
    logError();
    console.error("ErrorBoundary caught:", error, info);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "hsl(215, 50%, 10%)" }}>
          <div className="text-center max-w-md">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{
                background: "hsla(0, 72%, 51%, 0.1)",
                border: "1px solid hsla(0, 72%, 51%, 0.2)",
              }}
            >
              <AlertCircle className="w-8 h-8" style={{ color: "hsl(0, 72%, 51%)" }} aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-sm mb-6" style={{ color: "hsla(0,0%,100%,0.5)" }}>
              Try refreshing the page — if it keeps happening, contact support.
            </p>
            <button
              onClick={this.handleRefresh}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, hsl(217,91%,60%) 0%, hsl(224,91%,54%) 100%)",
              }}
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
