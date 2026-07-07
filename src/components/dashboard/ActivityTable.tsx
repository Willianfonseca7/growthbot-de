import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  title: string;
  render: (item: T) => ReactNode;
};

type ActivityTableProps<T> = {
  items: T[];
  columns: Column<T>[];
  emptyText: string;
};

export function ActivityTable<T>({ items, columns, emptyText }: ActivityTableProps<T>) {
  if (items.length === 0) {
    return <p className="table-empty">{emptyText}</p>;
  }

  return (
    <div className="table-shell">
      <table className="activity-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
