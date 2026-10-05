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
    console.error("App Error:", error);
  }, [error]);

  return (
    <main
      id="app-error-view"
      className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-[#ff1f3d]">
        Execution Alert
      </p>
      <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
        Something Went Wrong
      </h1>
      <p className="mt-4 max-w-md text-sm md:text-base text-neutral-400">
        An unexpected runtime exception was intercepted. You can attempt to reset
        the session or return to the studio home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-white px-6 py-3 text-xs font-mono uppercase tracking-wider text-black shadow transition hover:opacity-90 cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-full border border-neutral-800 bg-neutral-900 px-6 py-3 text-xs font-mono uppercase tracking-wider text-neutral-300 shadow-sm transition hover:bg-neutral-800 inline-block"
        >
          Studio Home
        </Link>
      </div>
    </main>
  );
}
