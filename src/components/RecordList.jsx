import React from 'react';
import { Calendar, Clock, MapPin, Image as ImageIcon, Edit2, Trash2, Shield, Eye, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';

export const RecordList = ({ 
  records, 
  viewMode, 
  isPastor, 
  onEditRecord, 
  onDeleteRecord, 
  onViewImage 
}) => {

  if (!records || records.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.1)',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto'
        }}>
          <Calendar size={32} />
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>No Collection Records Found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
          Try clearing your search query or adjusting your filters.
          {isPastor && " As Pastor, click 'Add Record' above to record a new contribution."}
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GRID / CARD VIEW (Mobile-First Touch Responsive)
  // -------------------------------------------------------------
  if (viewMode === 'grid') {
    return (
      <div className="record-grid">
        {records.map((rec, index) => (
          <div key={rec.id} className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            
            {/* Card Header: S.No & Amount */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                  #{index + 1}
                </span>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800' }} className="gradient-text-gold">
                    {formatCurrency(rec.amount)}
                  </div>
                </div>
              </div>

              {/* Donor Name */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.35rem', color: '#f8fafc' }}>
                {rec.name}
              </h3>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.85rem' }}>
                <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-gold)' }} />
                <span>{rec.address}</span>
              </div>
            </div>

            {/* Card Details Footer */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                
                {/* Date & Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={13} /> {formatDate(rec.date)}
                  </span>
                  {rec.time && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={13} /> {formatTime(rec.time)}
                    </span>
                  )}
                </div>

                {/* Receipt Image Badge */}
                {rec.imageUrl ? (
                  <button 
                    onClick={() => onViewImage(rec.imageUrl, rec.name)}
                    className="badge badge-emerald" 
                    style={{ cursor: 'pointer', border: 'none' }}
                    title="Click to view payment receipt photo"
                  >
                    <ImageIcon size={12} /> Receipt Image
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Image</span>
                )}
              </div>

              {rec.notes && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.75rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                  "{rec.notes}"
                </div>
              )}

              {/* PASTOR ONLY EDIT/DELETE CONTROLS */}
              {isPastor && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-subtle)' }}>
                  <button 
                    onClick={() => onEditRecord(rec)}
                    className="btn btn-secondary" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button 
                    onClick={() => onDeleteRecord(rec)}
                    className="btn btn-danger" 
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}

            </div>

          </div>
        ))}
      </div>
    );
  }

  // -------------------------------------------------------------
  // TABLE VIEW (Detailed Tabular View)
  // -------------------------------------------------------------
  return (
    <div className="glass-panel" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '2px solid rgba(245, 158, 11, 0.3)' }}>
            <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>S.No</th>
            <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Donor Name</th>
            <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Address</th>
            <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Amount (₹)</th>
            <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Date & Time</th>
            <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Proof</th>
            {isPastor && <th style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Pastor Actions</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((rec, index) => (
            <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} className="table-row-hover">
              <td style={{ padding: '0.85rem 1rem' }}>
                <span className="badge badge-gold">#{index + 1}</span>
              </td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#f8fafc' }}>
                {rec.name}
              </td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                {rec.address}
              </td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
                {formatCurrency(rec.amount)}
              </td>
              <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                <div>{formatDate(rec.date)}</div>
                {rec.time && <div style={{ fontSize: '0.75rem' }}>{formatTime(rec.time)}</div>}
              </td>
              <td style={{ padding: '0.85rem 1rem' }}>
                {rec.imageUrl ? (
                  <button 
                    onClick={() => onViewImage(rec.imageUrl, rec.name)}
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    <Eye size={12} /> View Image
                  </button>
                ) : (
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>None</span>
                )}
              </td>

              {isPastor && (
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => onEditRecord(rec)}
                      className="btn btn-secondary" 
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                      title="Edit Record"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => onDeleteRecord(rec)}
                      className="btn btn-danger" 
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                      title="Delete Record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
