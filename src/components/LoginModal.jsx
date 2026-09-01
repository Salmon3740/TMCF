import React, { useState } from 'react';
import { X, ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import { authenticatePastor } from '../utils/auth';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = authenticatePastor(name, password);
    if (result.success) {
      setError('');
      setName('');
      setPassword('');
      onLoginSuccess(result.user);
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>Pastor Admin Login</h2>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Authorized Pastor Portal</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          
          <div className="form-group">
            <label className="form-label">Pastor Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '2.4rem', width: '100%' }}
                required
                autoFocus
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.4rem', width: '100%' }}
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <ShieldCheck size={18} /> Login as Pastor
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
