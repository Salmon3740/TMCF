import React from 'react';
import { X, Download } from 'lucide-react';

export const ImagePreviewModal = ({ imageUrl, donorName, onClose }) => {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `Receipt_${donorName.replace(/[^a-zA-Z0-9]/g, '_')}.jpeg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '650px', padding: '1rem', background: 'rgba(10, 15, 26, 0.95)', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>
            Payment Receipt Proof - {donorName}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={handleDownload} style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}>
              <Download size={14} /> Download
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
              <X size={22} />
            </button>
          </div>
        </div>

        <div style={{ width: '100%', maxHeight: '75vh', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
          <img 
            src={imageUrl} 
            alt={`Receipt for ${donorName}`} 
            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }} 
          />
        </div>
      </div>
    </div>
  );
};
