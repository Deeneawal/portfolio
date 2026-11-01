"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-3">
      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Password"
        className="h-12 w-full rounded-xl bg-[#f5f5f7] px-4 text-[16px] text-ink outline-none ring-accent/50 placeholder:text-faint focus:ring-4"
      />
      {state.error && (
        <p role="alert" className="text-[14px] text-bad">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-accent text-[16px] font-medium text-white transition hover:bg-[#0077ed] disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
