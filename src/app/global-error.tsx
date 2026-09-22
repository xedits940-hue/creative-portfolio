"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Intercepted:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <main
          id="global-error-view"
          className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center font-sans"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-[#ff1f3d]">
            Critical Error Intercepted
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">
            System Error
          </h1>
          <p className="mt-4 max-w-md text-sm md:text-base text-neutral-400">
            A critical application error occurred. Click below to recover the
            current view.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-[#ff1f3d] px-6 py-3 text-xs font-mono uppercase tracking-wider text-white shadow transition hover:opacity-90 cursor-pointer"
            >
              Reset Session
            </button>
            <Link
              href="/"
              className="rounded-full border border-neutral-800 bg-neutral-900 px-6 py-3 text-xs font-mono uppercase tracking-wider text-neutral-300 shadow-sm transition hover:bg-neutral-800"
            >
              Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
