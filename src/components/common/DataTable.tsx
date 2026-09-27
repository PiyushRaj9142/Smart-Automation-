import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronUp, ChevronDown, Filter } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchableKey?: (row: T) => string;
  filterOptions?: { label: string; key: string; value: string }[];
  onFilterChange?: (value: string) => void;
  onRowClick?: (row: T) => void;
  exportFilename?: string;
  pageSize?: number;
  headerActions?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  title,
  subtitle,
  searchPlaceholder = 'Search records...',
  searchableKey,
  onRowClick,
  exportFilename = 'records-export',
  pageSize = 15,
  headerActions
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) => {
      if (searchableKey) {
        return searchableKey(row).toLowerCase().includes(q);
      }
      return Object.values(row).some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      );
    });
  }, [data, searchQuery, searchableKey]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = data.map((row) =>
      columns
        .map((c) => {
          const raw = row[c.key];
          const sanitized = String(raw !== undefined && raw !== null ? raw : '').replace(/"/g, '""');
          return `"${sanitized}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFilename}-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-md border border-slate-200 shadow-gov overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-3 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          {title && (
            <h3 className="text-sm font-bold text-gov-navy uppercase tracking-wide flex items-center gap-2">
              <span>{title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono font-normal">
                {filteredData.length} records
              </span>
            </h3>
          )}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gov-blue focus:border-gov-blue"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-700 flex items-center gap-1.5 transition"
            title="Export full table records to CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          {headerActions}
        </div>
      </div>

      {/* Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse gov-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`${
                    col.sortable !== false ? 'cursor-pointer hover:bg-slate-200 transition' : ''
                  } ${
                    col.align === 'center'
                      ? 'text-center'
                      : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      col.align === 'center'
                        ? 'justify-center'
                        : col.align === 'right'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable !== false && sortKey === col.key && (
                      <span>
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="w-3 h-3 text-gov-blue" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-gov-blue" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-slate-500 text-xs">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Filter className="w-6 h-6 text-slate-300" />
                    <span>No records found matching current criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                      }
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-3 py-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
        <div className="font-mono text-[11px]">
          Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
          >
            Prev
          </button>
          <span className="px-2 font-mono text-[11px]">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
