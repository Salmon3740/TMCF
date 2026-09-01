import React from 'react';
import { TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const StatsOverview = ({ records }) => {
  const totalCollected = records.reduce((sum, rec) => sum + (Number(rec.amount) || 0), 0);
  const totalDonors = records.length;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Accent Glow */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* Total Collected */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(245, 158, 11, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              TOTAL AMOUNT COLLECTED
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: '800' }} className="gradient-text-gold">
            {formatCurrency(totalCollected)}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Cumulative Reconstruction Fund
          </span>
        </div>

        {/* Total Donors / Contributions Count */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              TOTAL CONTRIBUTIONS
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald-light)' }}>
              <Users size={20} />
            </div>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#f8fafc' }}>
            {totalDonors} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>Entries</span>
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Registered Collection Records
          </span>
        </div>

      </div>

    </div>
  );
};
