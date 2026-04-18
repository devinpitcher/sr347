import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { SQL, sql, getTableColumns } from "drizzle-orm";

export function buildConflictUpdateColumns<T extends SQLiteTable, Q extends keyof T["_"]["columns"]>(table: T, columns: Q[], exclude = false) {
  const cls = getTableColumns(table);
  const keys = (exclude ? Object.keys(cls).filter((k) => !columns.includes(k as Q)) : columns) as Q[];
  return keys.reduce(
    (acc, column) => {
      const colName = cls[column].name;
      acc[column] = sql.raw(`excluded.${colName}`);
      return acc;
    },
    {} as Record<Q, SQL>
  );
}
