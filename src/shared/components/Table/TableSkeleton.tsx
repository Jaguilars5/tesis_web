export interface TableSkeletonClassNameProps {
  table: string;
  tbody: string;
  td: string | ((data: { rowIndex: number; colIndex: number }) => string);
  contend: string;
}

export interface TableSkeletonProps {
  columns: number;
  rows: number;
  className: TableSkeletonClassNameProps;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows,
  className,
}) => {
  return (
    <table className={className.table}>
      <tbody className={className.tbody}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => {
              const tdClassName =
                typeof className.td === "function"
                  ? className.td({ rowIndex, colIndex })
                  : className.td;

              return (
                <td key={colIndex} className={tdClassName}>
                  <div className={className.contend}></div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
