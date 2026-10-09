"use client";

import { Component, type ReactNode } from "react";
import { telemetry } from "@/lib/telemetry";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    telemetry.logError(error, `ErrorBoundary:${this.props.name || "root"}`);
    // Optional self-healing retry
    if (typeof window !== "undefined") {
      setTimeout(() => {
        this.setState({ hasError: false });
      }, 5000);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      // Graceful degradation: render children or clean empty container without breaking page
      return this.props.children;
    }

    return this.props.children;
  }
}
