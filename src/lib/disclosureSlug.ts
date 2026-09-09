// Builds the clean, public-facing filename for a mandatory disclosure PDF, e.g. "fee-structure-2026-27.pdf".
// Prefers the admin-set title so the URL never depends on whatever the uploaded file happened to be named
// (which may itself contain a stray timestamp/id if the source file was previously downloaded from this site).
export function disclosureSlug(d: { title?: string; file: { fileName: string } }): string {
  const base =
    d.title?.trim() ||
    d.file.fileName
      .replace(/\.pdf$/i, "")
      .replace(/^\d{10,}[_-]?/, "");

  const slug = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "document"}.pdf`;
}
