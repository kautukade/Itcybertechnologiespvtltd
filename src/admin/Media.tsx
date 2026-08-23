import { useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useAdminTable } from "../lib/cms";
import { useAuth, logActivity } from "../lib/auth";
import type { MediaRow } from "../types/db";
import { PageHead, AButton, AInput, ADrawer, AConfirm, FieldRow, toast, ErrorState, TableSkeleton, ABadge } from "./ui";

const db = supabase as unknown as SupabaseClient | null;

const TYPE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
};
const OK_TYPES = Object.keys(TYPE_EXT);
const MAX_BYTES = 10 * 1024 * 1024;

const isImage = (t: string) => t.startsWith("image/");

function fileExt(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return ext === "jpeg" ? "jpg" : ext;
}

function validateMedia(file: File): string | null {
  const expected = TYPE_EXT[file.type];
  if (!expected) return "Allowed: JPG, PNG, WEBP, AVIF or MP4";
  if (fileExt(file.name) !== expected) return "The file extension must match its media type";
  if (file.size > MAX_BYTES) return "Files must be 10 MB or smaller";
  if (file.size === 0) return "The selected file is empty";
  return null;
}

export default function Media() {
  const { rows, loading, error, refresh } = useAdminTable("media_library", "created_at");
  const { profile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaRow | null>(null);
  const [alt, setAlt] = useState("");
  const [deleting, setDeleting] = useState<MediaRow | null>(null);

  const upload = async (file: File) => {
    if (!db) return;
    const validation = validateMedia(file);
    if (validation) {
      toast(validation, "err");
      return;
    }
    setUploading(true);
    const ext = TYPE_EXT[file.type];
    const path = `media/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await db.storage.from("site-media").upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      toast(upErr.message, "err");
      setUploading(false);
      return;
    }
    const { data: pub } = db.storage.from("site-media").getPublicUrl(path);
    const { error: rowErr } = await db.from("media_library").insert({
      name: file.name,
      file_type: file.type,
      storage_path: path,
      public_url: pub.publicUrl,
      alt_text: "",
      folder: "general",
      uploaded_by: profile?.id ?? null,
    });
    if (rowErr) {
      await db.storage.from("site-media").remove([path]);
      setUploading(false);
      toast(rowErr.message, "err");
      return;
    }
    setUploading(false);
    await logActivity("media uploaded", "media_library", path);
    toast("Uploaded");
    refresh();
  };

  const saveAlt = async () => {
    if (!db || !selected) return;
    const { error: e } = await db.from("media_library").update({ alt_text: alt.slice(0, 500) }).eq("id", selected.id);
    if (e) {
      toast(e.message, "err");
      return;
    }
    await logActivity("media alt text updated", "media_library", selected.id);
    toast("Alt text saved");
    setSelected(null);
    refresh();
  };

  const remove = async () => {
    if (!db || !deleting) return;

    // Remove the library row first so a storage failure cannot leave public metadata
    // pointing at an object that no longer exists. A failed storage cleanup leaves an
    // orphaned object, which is safer and can be cleaned up later.
    const { error: rowError } = await db.from("media_library").delete().eq("id", deleting.id);
    if (rowError) {
      toast(rowError.message, "err");
      return;
    }

    const { error: storageError } = await db.storage.from("site-media").remove([deleting.storage_path]);
    await logActivity("media deleted", "media_library", deleting.id);
    setDeleting(null);
    setSelected(null);
    refresh();

    if (storageError) {
      toast(`Library entry deleted, but storage cleanup failed: ${storageError.message}`, "err");
      return;
    }
    toast("Deleted");
  };

  const replace = async (file: File) => {
    if (!db || !selected) return;
    const validation = validateMedia(file);
    if (validation) {
      toast(validation, "err");
      return;
    }
    const currentExt = fileExt(selected.storage_path);
    if (TYPE_EXT[file.type] !== currentExt) {
      toast("Replacement must keep the same file type. Delete and re-upload to change formats.", "err");
      return;
    }
    setUploading(true);
    const { error: e } = await db.storage.from("site-media").upload(selected.storage_path, file, { contentType: file.type, upsert: true });
    if (e) {
      setUploading(false);
      toast(e.message, "err");
      return;
    }
    const { error: rowError } = await db.from("media_library").update({
      name: file.name,
      file_type: file.type,
    }).eq("id", selected.id);
    setUploading(false);
    if (rowError) {
      toast(`File replaced, but metadata update failed: ${rowError.message}`, "err");
      return;
    }
    await logActivity("media replaced", "media_library", selected.id);
    toast("File replaced — same URL");
    setSelected(null);
    refresh();
  };

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead
        title="Media Library"
        desc="Site images and video, stored in the public site-media bucket. Active SVG uploads are intentionally disabled."
        actions={
          <>
            <input ref={fileRef} type="file" accept={OK_TYPES.join(",")} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value = ""; }} />
            <AButton loading={uploading} onClick={() => fileRef.current?.click()}>Upload file</AButton>
          </>
        }
      />

      {loading ? (
        <TableSkeleton cols={4} rows={4} />
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-lg p-12 text-center bg-white">
          <p className="text-[0.9rem] font-medium text-slate-600">No media yet</p>
          <p className="text-[0.8rem] text-slate-400 mt-1">Upload JPG, PNG, WEBP, AVIF or MP4 — up to 10 MB.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {rows.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelected(m); setAlt(m.alt_text ?? ""); }}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden text-left hover:border-blue-400 hover:shadow-md transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div className="h-28 bg-slate-100 flex items-center justify-center overflow-hidden">
                {isImage(m.file_type) ? (
                  <img src={m.public_url} alt={m.alt_text ?? m.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span className="font-mono text-[0.68rem] uppercase text-slate-400">{m.file_type.split("/")[1]}</span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-[0.76rem] font-medium text-slate-700 truncate">{m.name}</p>
                <p className="text-[0.66rem] text-slate-400 truncate">{m.alt_text || "no alt text"}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <ADrawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ""}>
        {selected && (
          <div>
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center h-44">
              {isImage(selected.file_type) ? (
                <img src={selected.public_url} alt={selected.alt_text ?? selected.name} className="max-h-full object-contain" />
              ) : (
                <video src={selected.public_url} controls className="w-full" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <ABadge tone="blue">{selected.file_type.split("/")[1]}</ABadge>
              <ABadge>{selected.folder}</ABadge>
            </div>
            <div className="mt-5">
              <FieldRow label="Public URL">
                <div className="flex gap-2">
                  <AInput readOnly value={selected.public_url} onFocus={(e) => e.target.select()} />
                  <AButton
                    variant="ghost"
                    onClick={() => { void navigator.clipboard.writeText(selected.public_url).then(() => toast("URL copied")); }}
                  >
                    Copy
                  </AButton>
                </div>
              </FieldRow>
            </div>
            <div className="mt-4">
              <FieldRow label="Alt text" hint="Describe the image for accessibility and SEO.">
                <AInput maxLength={500} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. ITCYBER AI operations dashboard" />
              </FieldRow>
            </div>
            <div className="mt-4">
              <FieldRow label="Replace file" hint="Keeps the same URL and file format. Delete and re-upload to change formats.">
                <input type="file" accept={OK_TYPES.join(",")} className="block text-[0.8rem] text-slate-500 file:mr-3 file:h-8 file:px-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:text-slate-700 file:text-[0.78rem] file:cursor-pointer hover:file:bg-slate-100" onChange={(e) => { const f = e.target.files?.[0]; if (f) void replace(f); e.target.value = ""; }} />
              </FieldRow>
            </div>
            <div className="flex gap-2 mt-7 pt-5 border-t border-slate-200">
              <AButton onClick={saveAlt}>Save alt text</AButton>
              <AButton variant="danger" onClick={() => setDeleting(selected)}>Delete</AButton>
            </div>
          </div>
        )}
      </ADrawer>

      <AConfirm
        open={!!deleting}
        title="Delete this file?"
        message="The library entry is removed first, then the storage object is cleaned up. Pages referencing its URL may show a broken image after deletion."
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
