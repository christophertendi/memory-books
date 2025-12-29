import { X } from 'lucide-react';
import { useState } from 'react';
import './BookCoverDesigner.css';

const BookCoverDesigner = ({ initialCover, onSave, onClose }) => {
  const [coverDesign, setCoverDesign] = useState(initialCover || {
    backgroundColor: '#2c2c2c',
    pattern: 'solid',
    textColor: '#ffffff',
  });

  const patterns = [
    { id: 'solid', name: 'Solid', preview: 'linear-gradient(135deg, currentColor, currentColor)' },
    { id: 'gradient', name: 'Gradient', preview: 'linear-gradient(135deg, currentColor, color-mix(in srgb, currentColor, black 30%))' },
    { id: 'dots', name: 'Dots', preview: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)' },
    { id: 'stripes', name: 'Stripes', preview: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' },
    { id: 'grid', name: 'Grid', preview: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)' },
    { id: 'diagonal', name: 'Diagonal', preview: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px)' },
  ];

  const presetColors = [
    '#2c2c2c', '#1e3a8a', '#14532d', '#7f1d1d', '#374151', '#475569',
    '#831843', '#713f12', '#065f46', '#1e40af', '#7c2d12', '#4c1d95'
  ];

  const handleSave = () => {
    onSave(coverDesign);
    onClose();
  };

  const getPatternStyle = (pattern) => {
    switch (pattern) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${coverDesign.backgroundColor}, color-mix(in srgb, ${coverDesign.backgroundColor}, black 30%))`
        };
      case 'dots':
        return {
          backgroundColor: coverDesign.backgroundColor,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        };
      case 'stripes':
        return {
          backgroundColor: coverDesign.backgroundColor,
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        };
      case 'grid':
        return {
          backgroundColor: coverDesign.backgroundColor,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        };
      case 'diagonal':
        return {
          backgroundColor: coverDesign.backgroundColor,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px)'
        };
      default:
        return { backgroundColor: coverDesign.backgroundColor };
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-designer" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h3 className="modal-title">Design Book Cover</h3>

        <div className="cover-preview-section">
          <div className="cover-preview" style={getPatternStyle(coverDesign.pattern)}>
            <div className="preview-title" style={{ color: coverDesign.textColor }}>
              Book Title
            </div>
            <div className="preview-pages" style={{ color: coverDesign.textColor }}>
              0/10 pages
            </div>
          </div>
        </div>

        <div className="designer-section">
          <label>Background Color</label>
          <div className="color-options">
            {presetColors.map(color => (
              <button
                key={color}
                className={`color-swatch ${coverDesign.backgroundColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setCoverDesign({ ...coverDesign, backgroundColor: color })}
              />
            ))}
            <input
              type="color"
              value={coverDesign.backgroundColor}
              onChange={(e) => setCoverDesign({ ...coverDesign, backgroundColor: e.target.value })}
              className="color-picker-custom"
            />
          </div>
        </div>

        <div className="designer-section">
          <label>Pattern</label>
          <div className="pattern-options">
            {patterns.map(pattern => (
              <button
                key={pattern.id}
                className={`pattern-option ${coverDesign.pattern === pattern.id ? 'active' : ''}`}
                onClick={() => setCoverDesign({ ...coverDesign, pattern: pattern.id })}
              >
                <div 
                  className="pattern-preview"
                  style={{
                    backgroundColor: '#4a5568',
                    backgroundImage: pattern.id === 'solid' ? 'none' : pattern.preview,
                    backgroundSize: pattern.id === 'gradient' ? 'cover' : '20px 20px'
                  }}
                />
                <span>{pattern.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="designer-section">
          <label>Text Color</label>
          <div className="text-color-options">
            <button
              className={`text-color-btn ${coverDesign.textColor === '#ffffff' ? 'active' : ''}`}
              onClick={() => setCoverDesign({ ...coverDesign, textColor: '#ffffff' })}
            >
              <div className="color-circle" style={{ backgroundColor: '#ffffff' }} />
              White
            </button>
            <button
              className={`text-color-btn ${coverDesign.textColor === '#000000' ? 'active' : ''}`}
              onClick={() => setCoverDesign({ ...coverDesign, textColor: '#000000' })}
            >
              <div className="color-circle" style={{ backgroundColor: '#000000' }} />
              Black
            </button>
            <button
              className={`text-color-btn ${coverDesign.textColor === '#fbbf24' ? 'active' : ''}`}
              onClick={() => setCoverDesign({ ...coverDesign, textColor: '#fbbf24' })}
            >
              <div className="color-circle" style={{ backgroundColor: '#fbbf24' }} />
              Gold
            </button>
          </div>
        </div>

        <div className="designer-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSave}>Save Design</button>
        </div>
      </div>
    </div>
  );
};

export default BookCoverDesigner;