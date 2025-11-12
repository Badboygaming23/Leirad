import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, ArrowUpDown, Eye, RefreshCw } from 'lucide-react';

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface Column {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit: (item: any) => void;
  onDelete?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const deepSearch = (obj: any, term: string): boolean => {
    const lowerCaseTerm = term.toLowerCase();
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value === null || value === undefined) continue;
        if (typeof value === 'object') {
          if (deepSearch(value, term)) return true;
        } else {
          if (String(value).toLowerCase().includes(lowerCaseTerm)) return true;
        }
      }
    }
    return false;
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => deepSearch(item, searchTerm));
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const requestSort = (key: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a data refresh for visual feedback
    setTimeout(() => {
        setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="bg-slate-100/80 backdrop-blur-md border border-slate-200 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="itemsPerPage" className="text-sm text-slate-600">Show</label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="p-2 border rounded-md text-sm bg-slate-50 border-slate-300"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
                 <span className="text-sm text-slate-600">entries</span>
            </div>
            <button 
                onClick={handleRefresh}
                className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
                aria-label="Refresh data"
                title="Refresh data"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
        </div>
        <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="w-full sm:w-auto p-2 border border-slate-300 rounded-md bg-slate-50"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.accessor}
                  onClick={() => requestSort(col.accessor)}
                  className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">{col.header} <ArrowUpDown size={14} /></div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedData.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                {columns.map(col => (
                  <td key={col.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {col.render ? col.render(item) : item[col.accessor]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900">{onDelete ? <Edit size={16}/> : <Eye size={16}/>}</button>
                  {onDelete && <button onClick={() => onDelete(item)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <nav className="mt-4 flex items-center justify-between" aria-label="Pagination">
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-100">Previous</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-100">Next</button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default DataTable;