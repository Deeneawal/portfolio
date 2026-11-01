import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-muted">404</p>
      <h1 className="display mt-3 text-5xl">Nothing here.</h1>
      <p className="mt-4 text-[17px] text-ink-2">That page doesn&apos;t exist, but plenty of stories do.</p>
      <Link href="/" className="mt-8 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-[#0077ed]">
        Back to all stories
      </Link>
    </main>
  );
}
