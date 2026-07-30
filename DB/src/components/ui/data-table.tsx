import * as React from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/states";

export interface DataTableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number | Date | null | undefined;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  align?: "left" | "right" | "center";
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  selectable?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterKeys?: (keyof T | ((row: T) => string))[];
  pageSize?: number;
  pageSizeOptions?: number[];
  initialSort?: { id: string; dir: "asc" | "desc" };
  toolbar?: React.ReactNode;
  bulkActions?: (selectedIds: string[]) => React.ReactNode;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

type SortState = { id: string; dir: "asc" | "desc" } | null;

export function DataTable<T>({
  data,
  columns,
  getRowId,
  selectable = false,
  searchable = true,
  searchPlaceholder = "Search…",
  filterKeys,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  initialSort = undefined,
  toolbar,
  bulkActions,
  onRowClick,
  emptyTitle = "No results",
  emptyDescription = "Try adjusting your filters or search terms.",
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortState>(initialSort ?? null);
  const [selection, setSelection] = React.useState<Record<string, boolean>>({});
  const [visible, setVisible] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(columns.map((c) => [c.id, true])),
  );
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  // Filter
  const filtered = React.useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) => {
      if (filterKeys && filterKeys.length) {
        return filterKeys.some((k) => {
          const v = typeof k === "function" ? k(row) : (row as any)[k];
          return String(v ?? "").toLowerCase().includes(q);
        });
      }
      return JSON.stringify(row).toLowerCase().includes(q);
    });
  }, [data, query, filterKeys]);

  // Sort
  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.id === sort.id);
    if (!col) return filtered;
    const getV = col.sortValue ?? ((r: T) => (col.accessor ? String(col.accessor(r)) : ""));
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = getV(a);
      const vb = getV(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sort, columns]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = React.useMemo(
    () => sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize),
    [sorted, currentPage, pageSize],
  );

  const visibleCols = columns.filter((c) => visible[c.id] !== false);
  const selectedIds = Object.entries(selection).filter(([, v]) => v).map(([k]) => k);
  const allOnPageSelected = paged.length > 0 && paged.every((r) => selection[getRowId(r)]);
  const someOnPageSelected = paged.some((r) => selection[getRowId(r)]);

  const toggleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable) return;
    setSort((cur) => {
      if (!cur || cur.id !== col.id) return { id: col.id, dir: "asc" };
      if (cur.dir === "asc") return { id: col.id, dir: "desc" };
      return null;
    });
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {searchable && (
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder={searchPlaceholder}
              className="h-9 pl-8"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {selectedIds.length > 0 && bulkActions && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs">
              <span className="text-muted-foreground">
                {selectedIds.length} selected
              </span>
              {bulkActions(selectedIds)}
            </div>
          )}
          {toolbar}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
                <SlidersHorizontal className="size-3.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Toggle columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.id}
                  checked={visible[c.id] !== false}
                  onCheckedChange={(v) =>
                    setVisible((s) => ({ ...s, [c.id]: !!v }))
                  }
                  onSelect={(e) => e.preventDefault()}
                >
                  {typeof c.header === "string" ? c.header : c.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card/40">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {selectable && (
                <TableHead className="w-9">
                  <Checkbox
                    aria-label="Select all rows on this page"
                    checked={
                      allOnPageSelected
                        ? true
                        : someOnPageSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(v) => {
                      setSelection((cur) => {
                        const next = { ...cur };
                        paged.forEach((r) => {
                          next[getRowId(r)] = !!v;
                        });
                        return next;
                      });
                    }}
                  />
                </TableHead>
              )}
              {visibleCols.map((col) => {
                const isSorted = sort?.id === col.id;
                const Icon = isSorted
                  ? sort.dir === "asc"
                    ? ChevronUp
                    : ChevronDown
                  : ArrowUpDown;
                return (
                  <TableHead
                    key={col.id}
                    className={cn(
                      "text-[11px] uppercase tracking-wider text-muted-foreground",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.headerClassName,
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-inherit transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        )}
                      >
                        {col.header}
                        <Icon
                          className={cn(
                            "size-3",
                            isSorted ? "text-foreground" : "text-muted-foreground/60",
                          )}
                        />
                      </button>
                    ) : (
                      col.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={visibleCols.length + (selectable ? 1 : 0)}
                  className="p-0"
                >
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    className="border-0 bg-transparent"
                  />
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row) => {
                const id = getRowId(row);
                const selected = !!selection[id];
                return (
                  <TableRow
                    key={id}
                    data-state={selected ? "selected" : undefined}
                    className={cn(onRowClick && "cursor-pointer")}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <TableCell className="w-9" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          aria-label="Select row"
                          checked={selected}
                          onCheckedChange={(v) =>
                            setSelection((cur) => ({ ...cur, [id]: !!v }))
                          }
                        />
                      </TableCell>
                    )}
                    {visibleCols.map((col) => (
                      <TableCell
                        key={col.id}
                        className={cn(
                          col.align === "right" && "text-right",
                          col.align === "center" && "text-center",
                          col.className,
                        )}
                      >
                        {col.accessor ? col.accessor(row) : (row as any)[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center gap-3 px-1 text-xs text-muted-foreground">
        <div>
          {sorted.length === 0
            ? "0 results"
            : `Showing ${currentPage * pageSize + 1}–${Math.min(
                (currentPage + 1) * pageSize,
                sorted.length,
              )} of ${sorted.length}`}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span>Rows</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(0);
            }}
          >
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="ml-2">
            Page {currentPage + 1} of {pageCount}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage(0)}
              disabled={currentPage === 0}
              aria-label="First page"
            >
              <ChevronsLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={currentPage >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRight className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage(pageCount - 1)}
              disabled={currentPage >= pageCount - 1}
              aria-label="Last page"
            >
              <ChevronsRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}