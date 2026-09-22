import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
        404 — Not Found
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition hover:opacity-90"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
