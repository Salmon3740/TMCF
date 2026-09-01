import React, { useState } from 'react';
import { X, Globe, Smartphone, CheckCircle, Server, Cloud, Copy, Check, Download, FileJson } from 'lucide-react';
import { exportBackupJSON, importBackupJSON } from '../utils/storage';

export const DeploymentModal = ({ isOpen, onClose, onDataRestored }) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TMCF_Church_Records_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importBackupJSON(event.target.result);
      if (result.success) {
        setImportStatus({ type: 'success', msg: `Successfully restored ${result.count} records!` });
        if (onDataRestored) onDataRestored();
      } else {
        setImportStatus({ type: 'error', msg: result.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', pb: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald-light)' }}>
              <Globe size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }} className="gradient-text-emerald">
                24/7 Deployment & Mobile Cloud Sync Guide
              </h2>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>How to make this website available online 24/7</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.875rem' }}>
          
          {/* Answer to User's Concern */}
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--accent-emerald-light)', marginBottom: '0.35rem' }}>
              <CheckCircle size={18} /> YES! 100% Deployable & Available 24/7 Online
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              This application is built using standard web technologies (React + Vite) designed to be hosted for <strong>FREE 24 hours a day, 7 days a week</strong> on global web hosting services like <strong>Vercel</strong> or <strong>Netlify</strong>.
            </p>
          </div>

          {/* How to Deploy Steps */}
          <div>
            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Server size={16} /> 3 Easy Steps to Host Online Free (24/7)
            </h4>
            <ol style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>
                <strong>Push code to GitHub</strong> or upload this folder to your GitHub account repository.
              </li>
              <li>
                Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>Vercel.com</a> or <a href="https://netlify.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)' }}>Netlify.com</a> (Free accounts).
              </li>
              <li>
                Click <strong>"Import Project"</strong> → select your repository → click <strong>Deploy</strong>! You will get a live 24/7 link like <code>https://tmcf-reconstruction.vercel.app</code> that Pastor Cornelius & church members can open on mobile browsers.
              </li>
            </ol>
          </div>

          {/* Backup & Data Sync */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileJson size={16} style={{ color: 'var(--accent-purple)' }} /> Backup & Data Synchronization
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
              Download a complete JSON database backup or restore data onto another device when changing mobile phones.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={handleExportBackup} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                <Download size={15} /> Export JSON Backup
              </button>

              <label className="btn btn-secondary" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                <FileJson size={15} /> Restore JSON Backup
                <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
              </label>
            </div>

            {importStatus && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: importStatus.type === 'success' ? 'var(--accent-emerald-light)' : '#f87171' }}>
                {importStatus.msg}
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <button className="btn btn-primary" onClick={onClose}>
              Got It
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
