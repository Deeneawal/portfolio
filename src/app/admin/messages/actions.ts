"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { deleteMessage, MESSAGE_ID, setMessageRead } from "@/lib/contact/store";

function messageId(formData: FormData): string | null {
  const id = String(formData.get("id") ?? "");
  return MESSAGE_ID.test(id) ? id : null;
}

export async function markRead(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = messageId(formData);
  if (id) await setMessageRead(id, formData.get("read") === "1");
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function removeMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = messageId(formData);
  if (id) await deleteMessage(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
