import { useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useAdminTable } from "../lib/cms";
import { useAuth, logActivity } from "../lib/auth";
import type { MediaRow } from "../types/db";
import { PageHead, AButton, AInput, ADrawer, AConfirm, FieldRow, toast, ErrorState, TableSkeleton, ABadge } from "./ui";

const db = supabase as unknown as SupabaseClient | null;

const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "video/mp4"];
const MAX_BYTES = 10 * 1024 * 1024;

const isImage = (t: string) => t.startsWith("image/");

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
    if (!OK_TYPES.includes(file.type)) {
      toast("Allowed: JPG, PNG, WEBP, AVIF, SVG, MP4", "err");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast("Files must be 10 MB or smaller", "err");
      return;
    }
    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const path = `media/${Date.now()}-${safeName}`;
    const { error: upErr } = await db.storage.from("site-media").upload(path, file, { contentType: file.type });
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
    setUploading(false);
    if (rowErr) {
      toast(rowErr.message, "err");
      return;
    }
    await logActivity("media uploaded", "media_library", path);
    toast("Uploaded");
    refresh();
  };

  const saveAlt = async () => {
    if (!db || !selected) return;
    const { error: e } = await db.from("media_library").update({ alt_text: alt }).eq("id", selected.id);
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
    await db.storage.from("site-media").remove([deleting.storage_path]);
    const { error: e } = await db.from("media_library").delete().eq("id", deleting.id);
    if (e) {
      toast(e.message, "err");
      return;
    }
    await logActivity("media deleted", "media_library", deleting.id);
    toast("Deleted");
    setDeleting(null);
    refresh();
  };

  const replace = async (file: File) => {
    if (!db || !selected) return;
    setUploading(true);
    const { error: e } = await db.storage.from("site-media").upload(selected.storage_path, file, { contentType: file.type, upsert: true });
    setUploading(false);
    if (e) {
      toast(e.message, "err");
      return;
    }
    toast("File replaced — same URL");
    setSelected(null);
  };

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead
        title="Media Library"
        desc="Site images and video, stored in the public site-media bucket."
        actions={
          <>
            <input ref={fileRef} type="file" accept={OK_TYPES.join(",")} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
            <AButton loading={uploading} onClick={() => fileRef.current?.click()}>Upload file</AButton>
          </>
        }
      />

      {loading ? (
        <TableSkeleton cols={4} rows={4} />
      ) : rows.length === 0 ? (
        <div className="border border-dashed border-slate-300 rounded-lg p-12 text-center bg-white">
          <p className="text-[0.9rem] font-medium text-slate-600">No media yet</p>
          <p className="text-[0.8rem] text-slate-400 mt-1">Upload JPG, PNG, WEBP, AVIF, SVG or MP4 — up to 10 MB.</p>
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
                    onClick={() => { navigator.clipboard.writeText(selected.public_url).then(() => toast("URL copied")); }}
                  >
                    Copy
                  </AButton>
                </div>
              </FieldRow>
            </div>
            <div className="mt-4">
              <FieldRow label="Alt text" hint="Describe the image for accessibility and SEO.">
                <AInput value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. ITCYBER AI operations dashboard" />
              </FieldRow>
            </div>
            <div className="mt-4">
              <FieldRow label="Replace file" hint="Keeps the same URL — useful for fixing an asset without updating references.">
                <input type="file" accept={OK_TYPES.join(",")} className="block text-[0.8rem] text-slate-500 file:mr-3 file:h-8 file:px-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:text-slate-700 file:text-[0.78rem] file:cursor-pointer hover:file:bg-slate-100" onChange={(e) => { const f = e.target.files?.[0]; if (f) replace(f); }} />
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
        message="The file is removed from storage and from the library. Pages referencing its URL will show a broken image."
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
