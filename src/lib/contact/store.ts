import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ANALYTICS_BUCKET, isMissingTableError } from "../analytics/storageStore";
import { getServiceClient } from "../supabase";
import type { ContactInput } from "./schema";

/**
 * Contact messages are kept privately so the owner can read them in /admin/messages even if the
 * email never arrives. They go to the contact_messages table (supabase/migrations/0003) and,
 * until that migration is applied, to one small JSON file each in the private storage bucket.
 * Nothing here is readable with the public keys.
 */
export interface StoredMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string;
  message: string;
  page: string | null;
  country: string | null;
  city: string | null;
  email_sent: boolean;
  read: boolean;
}

const TABLE = "contact_messages";
const FOLDER = "messages";
const MAX_LISTED = 300;
export const MESSAGE_ID = /^[0-9]{13}-[a-f0-9]{8}$/;

/** Sortable by time: thirteen-digit milliseconds, then a short random part. */
export function newMessageId(now = Date.now()): string {
  return `${String(now).padStart(13, "0")}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

export function messageStoreConfigured(): boolean {
  return getServiceClient() !== null;
}

const filePath = (id: string) => `${FOLDER}/${id}.json`;

async function writeFile(supabase: SupabaseClient, message: StoredMessage): Promise<string | null> {
  const { error } = await supabase.storage
    .from(ANALYTICS_BUCKET)
    .upload(filePath(message.id), JSON.stringify(message), { contentType: "application/json", upsert: true, cacheControl: "0" });
  return error ? error.message : null;
}

async function readFile(supabase: SupabaseClient, id: string): Promise<StoredMessage | null> {
  const { data } = await supabase.storage.from(ANALYTICS_BUCKET).download(filePath(id));
  if (!data) return null;
  try {
    const parsed = JSON.parse(await data.text()) as StoredMessage;
    return MESSAGE_ID.test(parsed.id) ? parsed : null;
  } catch {
    return null;
  }
}

type Meta = { page?: string | null; country?: string | null; city?: string | null; emailSent: boolean };

/** Saves one message. Returns false only when nothing could be stored. */
export async function saveMessage(input: Pick<ContactInput, "name" | "email" | "company" | "message">, meta: Meta): Promise<boolean> {
  const supabase = getServiceClient();
  if (!supabase) return false;
  const message: StoredMessage = {
    id: newMessageId(),
    created_at: new Date().toISOString(),
    name: input.name,
    email: input.email,
    company: input.company,
    message: input.message,
    page: meta.page ?? null,
    country: meta.country ?? null,
    city: meta.city ?? null,
    email_sent: meta.emailSent,
    read: false,
  };
  const { error } = await supabase.from(TABLE).insert(message);
  if (!error) return true;
  if (!isMissingTableError(error)) console.error("[contact] table insert failed:", error.message);
  const fileError = await writeFile(supabase, message);
  if (fileError) console.error("[contact] storage save failed:", fileError);
  return fileError === null;
}

export interface MessageList {
  configured: boolean;
  messages: StoredMessage[];
  /** True while the table from migration 0003 doesn't exist yet. */
  storageOnly: boolean;
  error?: string;
}

/** Newest first, from the table and from storage together, so nothing is hidden while the table is being set up. */
export async function listMessages(): Promise<MessageList> {
  const supabase = getServiceClient();
  if (!supabase) return { configured: false, messages: [], storageOnly: false };

  const byId = new Map<string, StoredMessage>();
  let storageOnly = false;
  let problem: string | undefined;

  const { data: rows, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false }).limit(MAX_LISTED);
  if (error) {
    if (isMissingTableError(error)) storageOnly = true;
    else problem = error.message;
  }
  for (const row of (rows ?? []) as StoredMessage[]) byId.set(row.id, row);

  const bucket = supabase.storage.from(ANALYTICS_BUCKET);
  const { data: files } = await bucket.list(FOLDER, { limit: 1000, sortBy: { column: "name", order: "desc" } });
  const ids = (files ?? [])
    .map((f) => f.name.replace(/\.json$/, ""))
    .filter((id) => MESSAGE_ID.test(id) && !byId.has(id))
    .slice(0, MAX_LISTED);
  for (let i = 0; i < ids.length; i += 25) {
    const chunk = await Promise.all(ids.slice(i, i + 25).map((id) => readFile(supabase, id)));
    for (const m of chunk) if (m) byId.set(m.id, m);
  }

  const messages = [...byId.values()].sort((a, b) => b.id.localeCompare(a.id)).slice(0, MAX_LISTED);
  return { configured: true, messages, storageOnly, error: problem };
}

/** How many messages are still marked unread. Used for the badge on the dashboard. */
export async function countUnread(): Promise<number> {
  const list = await listMessages();
  return list.messages.filter((m) => !m.read).length;
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase || !MESSAGE_ID.test(id)) return;
  await supabase.from(TABLE).update({ read }).eq("id", id);
  const file = await readFile(supabase, id);
  if (file) await writeFile(supabase, { ...file, read });
}

export async function deleteMessage(id: string): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase || !MESSAGE_ID.test(id)) return;
  await supabase.from(TABLE).delete().eq("id", id);
  await supabase.storage.from(ANALYTICS_BUCKET).remove([filePath(id)]);
}
