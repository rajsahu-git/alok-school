"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $getRoot,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  $insertNodes,
  LexicalEditor,
  EditorState,
  DecoratorNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListNode, ListItemNode } from "@lexical/list";
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_TABLE_COMMAND, TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { apiClient } from "@/lib/apiClient";

// ─── Image Node ───────────────────────────────────────────────────────────────

type SerializedImageNode = Spread<{ src: string; alt: string; type: "image"; version: 1 }, SerializedLexicalNode>;

class ImageNode extends DecoratorNode<any> {
  __src: string;
  __alt: string;

  static getType() { return "image"; }
  static clone(node: ImageNode) { return new ImageNode(node.__src, node.__alt, node.__key); }

  constructor(src: string, alt: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  static importJSON(data: SerializedImageNode): ImageNode {
    return new ImageNode(data.src, data.alt);
  }

  exportJSON(): SerializedImageNode {
    return { type: "image", version: 1, src: this.__src, alt: this.__alt };
  }

  createDOM() {
    const span = document.createElement("span");
    span.style.display = "block";
    return span;
  }

  updateDOM() { return false; }

  exportDOM() {
    const img = document.createElement("img");
    img.src = this.__src;
    img.alt = this.__alt;
    img.style.cssText = "max-width:100%;border-radius:8px;margin:8px 0;display:block;";
    return { element: img };
  }

  static importDOM() {
    return {
      img: () => ({
        conversion: (domNode: HTMLElement) => {
          const img = domNode as HTMLImageElement;
          return { node: new ImageNode(img.src, img.alt ?? "") };
        },
        priority: 0 as const,
      }),
    };
  }

  decorate(): any {
    return (
      <img
        src={this.__src}
        alt={this.__alt}
        style={{ maxWidth: "100%", borderRadius: 8, margin: "8px 0", display: "block" }}
        draggable={false}
      />
    );
  }

  isInline() { return false; }
}

function $createImageNode(src: string, alt: string): ImageNode {
  return new ImageNode(src, alt);
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Bold       = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 4h8a4 4 0 0 1 0 8H6V4zm0 8h9a4 4 0 0 1 0 8H6v-8z"/></svg>;
const Italic     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M10 4h4l-4 16H6l4-16zm4 0h4v2h-4V4zM6 18h4v2H6v-2z"/></svg>;
const Underline  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 3v7a6 6 0 0 0 12 0V3h-2v7a4 4 0 0 1-8 0V3H6zm-1 15h14v2H5v-2z"/></svg>;
const Strike     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.116H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z"/></svg>;
const CodeIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>;
const ALeft      = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 4h18v2H3V4zm0 4h12v2H3V8zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"/></svg>;
const ACenter    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 4h18v2H3V4zm3 4h12v2H6V8zm-3 4h18v2H3v-2zm3 4h12v2H6v-2z"/></svg>;
const ARight     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 4h18v2H3V4zm6 4h12v2H9V8zm-6 4h18v2H3v-2zm6 4h12v2H9v-2z"/></svg>;
const AJustify   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h14v2H3v-2z"/></svg>;
const OLIcon     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-8v2h14V3H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>;
const ULIcon     = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2zM2 6.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>;
const TableIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 3h18v18H3V3zm2 8v4h5v-4H5zm0 6v2h5v-2H5zm7-6v4h5v-4h-5zm0 6v2h5v-2h-5zM5 5v4h14V5H5z"/></svg>;
const ImgIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>;
const LinkIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>;
const UndoIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>;
const RedoIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>;
const SaveIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>;
const QuoteIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>;
const UploadIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>;
const TrashIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;
const EditIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>;

function getDriveImgUrl(thumbnail: string | Record<string, unknown> | undefined): string | null {
  if (!thumbnail) return null;
  if (typeof thumbnail === "object") {
    const id = (thumbnail as Record<string, unknown>).fileId ?? (thumbnail as Record<string, unknown>).id;
    return id ? `/api/drive-image?id=${id}` : null;
  }
  if (thumbnail.includes("id=")) {
    const id = thumbnail.match(/[?&]id=([^&]+)/)?.[1];
    return id ? `/api/drive-image?id=${id}` : null;
  }
  return `/api/drive-image?id=${thumbnail}`;
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────

function Btn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className="p-1.5 rounded text-foreground hover:bg-secondary transition-colors"
    >
      {children}
    </button>
  );
}

function Sep() { return <div className="w-px h-5 bg-border mx-0.5 flex-shrink-0" />; }

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ onImageUpload }: { onImageUpload: () => void }) {
  const [editor] = useLexicalComposerContext();

  const fmt = (f: "bold" | "italic" | "underline" | "strikethrough" | "code") =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, f);

  const aln = (a: "left" | "center" | "right" | "justify") =>
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, a);

  const block = (type: string) => {
    editor.update(() => {
      const sel = $getSelection();
      if (!$isRangeSelection(sel)) return;
      if (type === "paragraph") $setBlocksType(sel, () => $createParagraphNode());
      else if (type === "quote") $setBlocksType(sel, () => $createQuoteNode());
      else $setBlocksType(sel, () => $createHeadingNode(type as "h1" | "h2" | "h3"));
    });
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (!url) return;
    editor.update(() => {
      const sel = $getSelection();
      if ($isRangeSelection(sel)) {
        const text = sel.getTextContent() || url;
        const dom = new DOMParser().parseFromString(`<a href="${url}">${text}</a>`, "text/html");
        sel.insertNodes($generateNodesFromDOM(editor, dom));
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-secondary/40 rounded-t-xl">
      <Btn title="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}><UndoIcon /></Btn>
      <Btn title="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}><RedoIcon /></Btn>
      <Sep />
      <select
        onChange={(e) => block(e.target.value)}
        defaultValue="paragraph"
        className="text-xs px-2 py-1 rounded border border-border bg-background text-foreground focus:outline-none cursor-pointer"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="quote">Quote</option>
      </select>
      <Sep />
      <Btn title="Bold" onClick={() => fmt("bold")}><Bold /></Btn>
      <Btn title="Italic" onClick={() => fmt("italic")}><Italic /></Btn>
      <Btn title="Underline" onClick={() => fmt("underline")}><Underline /></Btn>
      <Btn title="Strikethrough" onClick={() => fmt("strikethrough")}><Strike /></Btn>
      <Btn title="Inline Code" onClick={() => fmt("code")}><CodeIcon /></Btn>
      <Sep />
      <Btn title="Align Left" onClick={() => aln("left")}><ALeft /></Btn>
      <Btn title="Align Center" onClick={() => aln("center")}><ACenter /></Btn>
      <Btn title="Align Right" onClick={() => aln("right")}><ARight /></Btn>
      <Btn title="Justify" onClick={() => aln("justify")}><AJustify /></Btn>
      <Sep />
      <Btn title="Bullet List" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}><ULIcon /></Btn>
      <Btn title="Numbered List" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}><OLIcon /></Btn>
      <Sep />
      <Btn title="Insert Table (3×3)" onClick={() => editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: "3", columns: "3" })}><TableIcon /></Btn>
      <Btn title="Upload Image from Device" onClick={onImageUpload}><ImgIcon /></Btn>
      <Btn title="Insert Link" onClick={insertLink}><LinkIcon /></Btn>
      <Btn title="Blockquote" onClick={() => block("quote")}><QuoteIcon /></Btn>
    </div>
  );
}

// ─── Initial Content Plugin ──────────────────────────────────────────────────

function InitialContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!html) return;
    editor.update(() => {
      const dom = new DOMParser().parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().clear();
      $insertNodes(nodes);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// ─── Image Upload Plugin ──────────────────────────────────────────────────────

function ImageUploadPlugin({ triggerRef }: { triggerRef: React.MutableRefObject<(() => void) | null> }) {
  const [editor] = useLexicalComposerContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const compressAndInsert = (file: File) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      URL.revokeObjectURL(objectUrl);
      editor.update(() => {
        const imageNode = $createImageNode(dataUrl, file.name);
        const paragraphNode = $createParagraphNode();
        const sel = $getSelection();
        if ($isRangeSelection(sel)) sel.insertNodes([imageNode, paragraphNode]);
        else $insertNodes([imageNode, paragraphNode]);
      });
    };
    img.src = objectUrl;
  };

  triggerRef.current = () => inputRef.current?.click();

  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        compressAndInsert(file);
        e.target.value = "";
      }}
    />
  );
}

// ─── Editor Theme ─────────────────────────────────────────────────────────────

const editorTheme = {
  heading: { h1: "text-3xl font-bold my-3", h2: "text-2xl font-bold my-2", h3: "text-xl font-semibold my-2" },
  paragraph: "my-1 leading-relaxed",
  quote: "border-l-4 border-primary pl-4 italic text-muted-foreground my-3",
  list: { ul: "list-disc list-inside my-2 space-y-1", ol: "list-decimal list-inside my-2 space-y-1", listitem: "ml-4" },
  link: "text-primary underline cursor-pointer",
  text: { bold: "font-bold", italic: "italic", underline: "underline", strikethrough: "line-through", code: "bg-secondary font-mono text-sm px-1.5 py-0.5 rounded" },
  table: "border-collapse w-full my-4",
  tableCell: "border border-border px-3 py-2 text-sm",
  tableCellHeader: "border border-border px-3 py-2 text-sm font-semibold bg-secondary",
};

// ─── Article Type ───────────────────────────────────────────────────────────────

interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: string;
  thumbnail?: {
    fileId?: string;
    viewLink?: string;
    directLink?: string;
  };
  published: boolean;
  createdAt: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ArticleManager() {
  const [title, setTitle]           = useState("");
  const [category, setCategory]     = useState("");
  const [author, setAuthor]         = useState("");
  const [published, setPublished]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState<string | null>(null);

  // Articles list
  const [articles, setArticles]           = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Thumbnail
  const [thumbnail, setThumbnail]         = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const editorInstanceRef = useRef<LexicalEditor | null>(null);
  const imageUploadRef    = useRef<(() => void) | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  const fetchArticles = useCallback(async () => {
    setLoadingArticles(true);
    try {
      const data = await apiClient.get<{ count: number; articles: Article[] }>("/articles");
      setArticles(data.articles ?? []);
    } catch (e: unknown) {
      console.error("Failed to fetch articles:", e);
    } finally {
      setLoadingArticles(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setAuthor("");
    setPublished(false);
    setEditingId(null);
    setEditingContent("");
    removeThumbnail();
    setEditorKey((k) => k + 1);
    setError(null);
    setSuccess(null);
  };

  const handleEdit = (article: Article) => {
    setEditingId(article._id);
    setTitle(article.title);
    setCategory(article.category ?? "");
    setAuthor(article.author ?? "");
    setPublished(article.published ?? false);
    setEditingContent(article.content ?? "");
    setThumbnailPreview(getDriveImgUrl(article.thumbnail));
    setThumbnail(null);
    setEditorKey((k) => k + 1);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    setDeletingId(id);
    try {
      await apiClient.delete(`/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
      if (editingId === id) resetForm();
    } catch { alert("Failed to delete."); }
    finally { setDeletingId(null); }
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!title.trim()) { setError("Title is required."); return; }
    const editor = editorInstanceRef.current;
    if (!editor) { setError("Editor not ready."); return; }

    let html = "";
    editor.read(() => { html = $generateHtmlFromNodes(editor); });
    if (!html || html === "<p><br></p>") { setError("Content cannot be empty."); return; }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", html);
      formData.append("category", category.trim());
      formData.append("author", author.trim());
      formData.append("published", String(published));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      if (editingId) {
        await apiClient.put(`/articles/${editingId}`, formData);
        setSuccess("Article updated successfully!");
      } else {
        await apiClient.post("/articles", formData);
        setSuccess("Article published successfully!");
      }
      resetForm();
      await fetchArticles();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {editingId ? "Edit Article" : "Article Manager"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {editingId ? "Update the existing article details" : "Write, manage, and publish articles for the school blog/news"}
          </p>
        </div>
        {editingId && (
          <button
            onClick={resetForm}
            className="text-sm px-4 py-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Meta + Thumbnail */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">Article Details</p>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Article title..."
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(null); }}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Author name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Category (e.g. Science, Sports, Notice)..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div> */}
        </div>

        {/* Publish switch & Thumbnail */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Thumbnail */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Thumbnail Image</p>
            {thumbnailPreview ? (
              <div className="relative w-48 rounded-xl overflow-hidden border border-border group">
                <img src={thumbnailPreview} alt="thumbnail" className="w-full aspect-video object-cover" />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="flex items-center gap-2 w-fit px-4 py-2.5 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 text-sm text-muted-foreground hover:text-primary transition-all"
              >
                <UploadIcon />
                Upload Thumbnail
              </button>
            )}
            <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
          </div>

          {/* Published toggle */}
          {/* <div className="flex items-center gap-3 self-end sm:self-center">
            <label className="text-sm font-medium text-foreground cursor-pointer select-none" htmlFor="published-checkbox">
              Publish Status:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="published-checkbox"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-background cursor-pointer"
              />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {published ? "Published" : "Draft"}
              </span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <LexicalComposer key={editorKey} initialConfig={{
          namespace: "ArticleEditor",
          theme: editorTheme,
          onError: (err: Error) => console.error(err),
          nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, TableNode, TableCellNode, TableRowNode, ImageNode],
        }}>
          <Toolbar onImageUpload={() => imageUploadRef.current?.()} />
          <div className="relative min-h-[420px] p-5">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="outline-none min-h-[400px] text-sm text-foreground leading-relaxed"
                  aria-placeholder="Start writing your article content here..."
                  placeholder={
                    <div className="absolute top-5 left-5 text-muted-foreground text-sm pointer-events-none select-none">
                      Start writing your article content here...
                    </div>
                  }
                />
              }
              placeholder={
                <div className="absolute top-5 left-5 text-muted-foreground text-sm pointer-events-none select-none">
                  Start writing your article content here...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <TablePlugin />
            <ImageUploadPlugin triggerRef={imageUploadRef} />
            {editingContent && <InitialContentPlugin html={editingContent} />}
            <OnChangePlugin
              onChange={(_state: EditorState, editor: LexicalEditor) => {
                editorInstanceRef.current = editor;
              }}
            />
          </div>
        </LexicalComposer>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div>
          {error   && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <SaveIcon />}
          {saving ? (editingId ? "Updating…" : "Publishing…") : (editingId ? "Update Article" : "Publish Article")}
        </button>
      </div>

      {/* ─── Published Articles ─── */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-foreground">
            Articles
            <span className="ml-2 text-sm font-normal text-muted-foreground">({articles.length})</span>
          </p>
          <button onClick={fetchArticles} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refresh</button>
        </div>

        {loadingArticles ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-video bg-secondary" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No articles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => {
              const thumbnailSrc = getDriveImgUrl(article.thumbnail);
              return (
                <div key={article._id} className="rounded-xl border border-border overflow-hidden flex flex-col bg-background relative">
                  {/* Status Badge */}
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${article.published ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {article.published ? "Published" : "Draft"}
                  </span>

                  {thumbnailSrc ? (
                    <img src={thumbnailSrc} alt={article.title} className="w-full aspect-video object-cover" />
                  ) : (
                    <div className="w-full aspect-video bg-secondary flex items-center justify-center text-muted-foreground text-xs">No thumbnail</div>
                  )}

                  <div className="p-3 flex flex-col gap-2 flex-1">
                    <p className="text-sm font-semibold text-foreground line-clamp-2" title={article.title}>{article.title}</p>
                    
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {article.category && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-primary font-medium">
                          {article.category}
                        </span>
                      )}
                      {article.author && (
                        <span className="text-[10px] text-muted-foreground">
                          By: {article.author}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-auto">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors"
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        disabled={deletingId === article._id}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {deletingId === article._id
                          ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          : <TrashIcon />}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}