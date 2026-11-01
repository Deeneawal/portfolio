import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main id="main" className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-8 shadow-[var(--shadow-tile)] ring-1 ring-black/[0.04]">
        <span className="grid size-11 place-items-center rounded-full bg-ink text-[14px] font-semibold text-white">ZK</span>
        <h1 className="display mt-5 text-3xl">Owner dashboard</h1>
        <p className="mt-2 text-[15px] text-muted">Private analytics for this portfolio.</p>
        <LoginForm />
      </div>
    </main>
  );
}
