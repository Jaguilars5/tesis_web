import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, type JSX } from "react";

import type { TableColumnProps, TableProps } from "./tableProps";

export const CustomTable = <T,>({
  columns,
  data,
  className,
  isLoading,
  expandOptions,
  expandedRows: controlledExpandedRows,
  onToggleRow,
  emptyMessage = "No hay datos disponibles",
  loadingMessage = "Cargando...",
  rowActions,
  actionsTitle,
}: TableProps<T>): JSX.Element => {
  const [internalExpandedRows, setInternalExpandedRows] = useState<
    Record<string | number, boolean>
  >({});

  // elegir modo controlado o no controlado
  const expandedRows: Record<string | number, boolean> =
    controlledExpandedRows ?? internalExpandedRows;

  const toggleRow = (id: string | number): void => {
    if (onToggleRow) {
      onToggleRow(id);
    } else {
      setInternalExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  // columnas visibles segun condición
  const visibleColumns: TableColumnProps<T>[] = columns.filter((col) => {
    if (col.condition) {
      return col.condition(data[0]);
    }
    return true;
  });

  const {
    table = "",
    thead = "",
    trHead = "",
    tbody = "",
    trBody = "",
    notFound = "",
    moreHeader = "",
    moreCell = "",
    moreButton = "h-8 w-8 p-0 flex items-center justify-center",
    expandedRow = "",
    actions = "",
    container = "",
  } = className || {};

  const { button: buttonClassName, expandedCell: expandedCellClassName } =
    expandOptions?.className || {};

  const getHiddenColumns = (): TableColumnProps<T>[] =>
    visibleColumns.filter((col) => {
      const th = typeof col.className?.th === "string" ? col.className?.th : "";
      const td = typeof col.className?.td === "string" ? col.className?.td : "";
      return /\bhidden\b/.test(th) || /\bhidden\b/.test(td);
    });

  const resolveClass = (
    base: string | ((row: T, arg?: any) => string) | undefined,
    row: T,
    arg?: any
  ): string => (typeof base === "function" ? base(row, arg) : base || "");

  return (
    <div className={`w-full overflow-auto ${container}`}>
      <table className={table}>
        <thead className={thead}>
          <tr className={trHead}>
            {visibleColumns.map((col) => (
              <th key={col.key} className={col.className?.th || ""} scope="col">
                {col.renderHeader ? col.renderHeader() : col.label}
              </th>
            ))}
            {getHiddenColumns().length > 0 && (
              <th className={moreHeader}>Más</th>
            )}
            {rowActions && <th className={actions}>{actionsTitle}</th>}
          </tr>
        </thead>

        <tbody className={tbody}>
          {isLoading ? (
            <tr className={resolveClass(trBody, {} as T)}>
              <td className="text-center" colSpan={visibleColumns.length + 1}>
                {loadingMessage}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr className={resolveClass(trBody, {} as T)}>
              <td
                className={notFound}
                colSpan={
                  visibleColumns.length +
                  (getHiddenColumns().length > 0 ? 1 : 0) +
                  (rowActions ? 1 : 0)
                }
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const id = (row as any).id ?? idx;
              const hiddenCols = getHiddenColumns();

              return (
                <React.Fragment key={id}>
                  <tr className={resolveClass(trBody, row)}>
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className={resolveClass(col.className?.td, row, col)}
                      >
                        {col.render
                          ? col.render(row, idx)
                          : (row as any)[col.key]}
                      </td>
                    ))}
                    {hiddenCols.length > 0 && (
                      <td className={moreCell}>
                        <button
                          aria-expanded={!!expandedRows[id]}
                          className={buttonClassName || moreButton}
                          onClick={() => toggleRow(id)}
                        >
                          {expandedRows[id] ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </td>
                    )}
                    {rowActions && <td>{rowActions(row)}</td>}
                  </tr>

                  {expandedRows[id] && hiddenCols.length > 0 && (
                    <tr className={expandedCellClassName || expandedRow}>
                      <td
                        className="p-2"
                        colSpan={
                          visibleColumns.length + 1 + (rowActions ? 1 : 0)
                        }
                      >
                        <div className="grid gap-1 text-sm">
                          {hiddenCols.map((col) => (
                            <div key={col.key} className="grid grid-cols-2">
                              <span className="font-medium">{col.label}:</span>
                              <span>
                                {col.render
                                  ? col.render(row, idx)
                                  : (row as any)[col.key]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
