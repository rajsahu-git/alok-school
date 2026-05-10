import type { ReactNode } from "react";

export interface ColumnDef<T = Record<string, unknown>> {
  label: string;
  key: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface Action<T = Record<string, unknown>> {
  label: string;
  onClick: (row: T) => void;
  icon?: ReactNode;
  variant?: "default" | "danger" | "success";
}

export interface AdminTableProps<T = Record<string, unknown>> {
  columns: ColumnDef<T>[];
  data: T[];
  actions?: Action<T>[];
  showPagination?: boolean;
  paginationInfo?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  emptyMessage?: string;
  className?: string;
}

export default function AdminTable<T extends Record<string, unknown>>({
  columns,
  data,
  actions,
  showPagination = false,
  paginationInfo,
  onPageChange,
  onSort,
  sortKey,
  sortDirection,
  emptyMessage = "No data available",
  className = "",
}: AdminTableProps<T>) {
  const handleSort = (key: string) => {
    if (onSort && columns.find((c) => c.key === key)?.sortable) {
      const newDirection = sortKey === key && sortDirection === "asc" ? "desc" : "asc";
      onSort(key, newDirection);
    }
  };

  const getSortIndicator = (key: string) => {
    if (!onSort || !columns.find((c) => c.key === key)?.sortable) return null;
    if (sortKey !== key) {
      return <span className="ml-1 text-muted-foreground opacity-30">↕</span>;
    }
    return sortDirection === "asc" ? (
      <span className="ml-1 text-primary">↑</span>
    ) : (
      <span className="ml-1 text-primary">↓</span>
    );
  };

  const getActionButtonClass = (variant?: "default" | "danger" | "success") => {
    const baseClass = "px-2 py-1 text-xs rounded-md transition-colors ";
    switch (variant) {
      case "danger":
        return baseClass + "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200";
      case "success":
        return baseClass + "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200";
      default:
        return baseClass + "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-semibold text-foreground ${
                    column.sortable && onSort ? "cursor-pointer hover:bg-secondary/50 select-none" : ""
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {getSortIndicator(column.key)}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions?.length ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-border bg-card transition-colors hover:bg-secondary/30 last:border-b-0"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-foreground">
                      {column.render
                        ? column.render(row)
                        : String(row[column.key] ?? "-")}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={getActionButtonClass(action.variant)}
                            type="button"
                          >
                            {action.icon && <span className="mr-1">{action.icon}</span>}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && paginationInfo && onPageChange && (
        <div className="mt-4 flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing {(paginationInfo.currentPage - 1) * paginationInfo.totalItems / paginationInfo.totalPages + 1}-
            {Math.min(
              paginationInfo.currentPage * (paginationInfo.totalItems / paginationInfo.totalPages),
              paginationInfo.totalItems
            )}{" "}
            of {paginationInfo.totalItems} entries
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(paginationInfo.currentPage - 1)}
              disabled={paginationInfo.currentPage === 1}
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3 py-1 text-sm text-foreground transition-colors hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (paginationInfo.totalPages <= 5) return true;
                  if (page === 1 || page === paginationInfo.totalPages) return true;
                  if (Math.abs(page - paginationInfo.currentPage) <= 1) return true;
                  if (Math.abs(page - paginationInfo.currentPage) === 2) return true;
                  return false;
                })
                .map((page, index, filtered) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && filtered[index - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <button
                      onClick={() => onPageChange(page)}
                      className={`inline-flex min-w-[2rem] items-center justify-center rounded-md border px-3 py-1 text-sm transition-colors ${
                        page === paginationInfo.currentPage
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-secondary/50"
                      }`}
                      type="button"
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => onPageChange(paginationInfo.currentPage + 1)}
              disabled={paginationInfo.currentPage === paginationInfo.totalPages}
              className="inline-flex items-center justify-center rounded-md border border-border bg-card px-3 py-1 text-sm text-foreground transition-colors hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
