import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

import type { PaginationProps } from "./paginationProps";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const Pagination = ({
  page,
  pageSize,
  totalItems,
  isLoading = false,
  hasNextPage,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pageSizeLabel = "Filas por página:",
  onPageChange,
  onPageSizeChange,
  className = {},
  iconPrev,
  iconNext,
}: PaginationProps) => {
  const isFirstPage = page <= 1;

  const goToPrevious = useCallback(() => {
    if (!isFirstPage) onPageChange(page - 1);
  }, [isFirstPage, onPageChange, page]);

  const goToNext = useCallback(() => {
    if (hasNextPage) onPageChange(page + 1);
  }, [hasNextPage, onPageChange, page]);

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange(Number(e.target.value));
    },
    [onPageSizeChange],
  );

  const {
    wrapper = "flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3",
    info = "flex items-center gap-2 text-sm text-slate-600",
    controls = "flex items-center gap-1",
    select = "rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
    button = "inline-flex items-center justify-center rounded-md p-2 text-sm text-slate-600 hover:bg-slate-100 transition-colors",
    buttonDisabled = "inline-flex items-center justify-center rounded-md p-2 text-sm cursor-not-allowed text-slate-300 transition-colors",
    pageIndicator = "min-w-[4rem] text-center text-sm text-slate-600",
  } = className;

  return (
    <div className={wrapper}>
      {/* Left side: page size selector + item count */}
      <div className={info}>
        <span>{pageSizeLabel}</span>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className={select}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        {totalItems !== undefined && (
          <span className="ml-2">
            Pág. {page} · {totalItems} resultado{totalItems !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Right side: navigation controls */}
      <div className={controls}>
        <button
          type="button"
          disabled={isFirstPage || isLoading}
          onClick={goToPrevious}
          className={isFirstPage || isLoading ? buttonDisabled : button}
          aria-label="Página anterior"
        >
          {iconPrev ?? <ChevronLeft className="size-4" />}
        </button>

        <span className={pageIndicator}>Pág. {page}</span>

        <button
          type="button"
          disabled={!hasNextPage || isLoading}
          onClick={goToNext}
          className={!hasNextPage || isLoading ? buttonDisabled : button}
          aria-label="Página siguiente"
        >
          {iconNext ?? <ChevronRight className="size-4" />}
        </button>
      </div>
    </div>
  );
};
