import React, { useState, useEffect } from 'react';
import { X, Upload, Camera, Save, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { getCurrentFormattedDate, getCurrentFormattedTime } from '../utils/formatters';

export const RecordFormModal = ({ isOpen, onClose, onSave, editingRecord }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingRecord) {
      setName(editingRecord.name || '');
      setAddress(editingRecord.address || '');
      setAmount(editingRecord.amount || '');
      setDate(editingRecord.date || getCurrentFormattedDate());
      setTime(editingRecord.time || getCurrentFormattedTime());
      setImageUrl(editingRecord.imageUrl || '');
      setNotes(editingRecord.notes || '');
    } else {
      setName('');
      setAddress('');
      setAmount('');
      setDate(getCurrentFormattedDate());
      setTime(getCurrentFormattedTime());
      setImageUrl('');
      setNotes('');
    }
    setError('');
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  // Handle Image File Upload & Compression
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize image if necessary (max 800px width/height)
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight base64 JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setImageUrl(compressedBase64);
        setError('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter donor name.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter donor address or area.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid contribution amount.');
      return;
    }

    const recordData = {
      name: name.trim(),
      address: address.trim(),
      amount: parseFloat(amount),
      date: date || getCurrentFormattedDate(),
      time: time || getCurrentFormattedTime(),
      imageUrl: imageUrl || null,
      notes: notes.trim()
    };

    onSave(recordData, editingRecord ? editingRecord.id : null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', pb: '0.75rem' }}>
          <h2 style={{ fontSize: '1.25rem' }} className="gradient-text-gold">
            {editingRecord ? 'Edit Collection Record' : 'Add New Collection Record'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.7rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Donor Name */}
          <div className="form-group">
            <label className="form-label">Donor Name *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Pallapati Cornelius / K. David Raju"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Address / Location *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Main Road, TMCF Church Ward"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount (₹ INR) *</label>
            <input 
              type="number" 
              className="form-control"
              placeholder="e.g. 50000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="any"
              required
            />
          </div>

          {/* Date & Time Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input 
                type="date" 
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Optional Image Attachment */}
          <div className="form-group">
            <label className="form-label">Receipt / Payment Proof Image (Optional)</label>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.825rem', padding: '0.55rem 0.9rem' }}>
                <Upload size={16} /> Choose Image / Camera
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleImageFileChange} 
                  style={{ display: 'none' }}
                />
              </label>

              {imageUrl && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => setImageUrl('')}
                  style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
                >
                  Remove Image
                </button>
              )}
            </div>

            {/* Image Preview Thumbnail */}
            {imageUrl && (
              <div style={{ marginTop: '0.65rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', maxHeight: '140px', background: '#000', textAlign: 'center' }}>
                <img src={imageUrl} alt="Receipt preview" style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            )}
          </div>

          {/* Notes / Remarks */}
          <div className="form-group">
            <label className="form-label">Payment Notes / Ref Number (Optional)</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Bank Transfer, GPay ref #, Cash offering"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> {editingRecord ? 'Update Record' : 'Save Record'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
