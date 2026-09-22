"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error cleanly
    console.error("App Error:", error);
  }, [error]);

  return (
    <main
      id="app-error-view"
      className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-primary">
        Execution Alert
      </p>
      <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
        Something Went Wrong
      </h1>
      <p className="mt-4 max-w-md text-sm md:text-base text-muted-foreground">
        An unexpected runtime exception was intercepted. You can attempt to reset
        the session or return to the studio home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-primary px-6 py-3 text-xs font-mono uppercase tracking-wider text-primary-foreground shadow transition hover:opacity-90 cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-border bg-card px-6 py-3 text-xs font-mono uppercase tracking-wider text-foreground shadow-sm transition hover:bg-accent"
        >
          Studio Home
        </Link>
      </div>
    </main>
  );
}
