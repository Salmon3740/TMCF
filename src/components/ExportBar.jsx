import React from 'react';
import { Search, Download, Plus, LayoutGrid, Table as TableIcon, Filter, FileSpreadsheet } from 'lucide-react';
import { exportRecordsToExcel, exportRecordsToNativeExcel, exportRecordsToCSV } from '../utils/excelExport';

export const ExportBar = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  filteredRecords, 
  totalRecords, 
  isPastor, 
  onAddNewRecord
}) => {
  
  const handleExportXLSX = () => {
    const filterDesc = searchTerm ? `Search query: "${searchTerm}"` : `All ${filteredRecords.length} Records`;
    exportRecordsToExcel(filteredRecords, filterDesc);
  };

  const handleExportXLS = () => {
    exportRecordsToNativeExcel(filteredRecords);
  };

  const handleExportCSV = () => {
    exportRecordsToCSV(filteredRecords);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Top Controls: Search, View Mode, Export & Add */}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.85rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '220px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              className="form-control"
              placeholder="Search donor name, address, or details..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ paddingLeft: '2.4rem', width: '100%' }}
            />
            {searchTerm && (
              <button 
                onClick={() => onSearchChange('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={() => onViewModeChange('grid')}
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', border: 'none' }}
                title="Grid Card View (Mobile Friendly)"
              >
                <LayoutGrid size={15} /> Grid
              </button>
              <button 
                onClick={() => onViewModeChange('table')}
                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', border: 'none' }}
                title="Table View"
              >
                <TableIcon size={15} /> Table
              </button>
            </div>

            {/* DOWNLOAD EXCEL (.XLSX) BUTTON */}
            <button 
              onClick={handleExportXLSX}
              className="btn btn-emerald"
              style={{ padding: '0.6rem 0.95rem' }}
              title="Download Microsoft Excel (.xlsx) file"
            >
              <Download size={16} /> Excel (.XLSX)
            </button>

            {/* DOWNLOAD NATIVE EXCEL (.XLS) BUTTON */}
            <button 
              onClick={handleExportXLS}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 0.85rem', fontSize: '0.825rem', border: '1px solid var(--accent-emerald-light)' }}
              title="Download Native Excel (.xls) file - Opens directly in Microsoft Excel without Zip prompt"
            >
              <FileSpreadsheet size={15} style={{ color: 'var(--accent-emerald-light)' }} /> Excel (.XLS)
            </button>

            {/* DOWNLOAD CSV BUTTON */}
            <button 
              onClick={handleExportCSV}
              className="btn btn-secondary"
              style={{ padding: '0.6rem 0.75rem', fontSize: '0.825rem' }}
              title="Download CSV file"
            >
              .CSV
            </button>

            {/* PASTOR ONLY: ADD NEW RECORD */}
            {isPastor && (
              <button 
                onClick={onAddNewRecord}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.1rem' }}
              >
                <Plus size={18} /> Add Record
              </button>
            )}

          </div>
        </div>

        {/* Secondary Bar: Filter Info & Sort Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Filter size={15} style={{ color: 'var(--accent-gold)' }} />
            <span>Showing <strong>{filteredRecords.length}</strong> of <strong>{totalRecords}</strong> collection records</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Sort by:</label>
            <select 
              className="form-control"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="name-asc">Donor Name (A-Z)</option>
            </select>
          </div>

        </div>

      </div>

    </div>
  );
};
