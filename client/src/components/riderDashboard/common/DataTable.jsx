import React from "react";
import { MdSearch, MdFilterList } from "react-icons/md";

const DataTable = ({ columns, data, onSearch, title, actions }) => {
  return (
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
      <div className="p-4 border-b border-base-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {title && <h2 className="text-lg font-bold">{title}</h2>}
        
        <div className="flex w-full sm:w-auto gap-3 items-center">
          {onSearch && (
            <div className="relative flex-1 sm:w-64">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral text-xl" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-base-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          {actions}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-base-200/50 text-neutral text-sm">
              {columns.map((col, i) => (
                <th key={i} className="py-4 px-6 font-semibold whitespace-nowrap">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-neutral">No data found</td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-base-200/30 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-4 px-6 text-sm">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination could go here */}
      <div className="p-4 border-t border-base-200 text-sm text-neutral text-center sm:text-right">
        Showing {data.length} records
      </div>
    </div>
  );
};

export default DataTable;
