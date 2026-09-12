import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'amber' | 'blue' | 'purple' | 'red' | 'slate';
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'slate';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  color = 'emerald',
  badgeText,
  badgeType = 'success',
  onClick
}) => {
  const getColorStyles = () => {
    switch (color) {
      case 'amber':
        return { bg: 'var(--accent-50)', text: 'var(--accent-600)', border: 'var(--accent-100)' };
      case 'blue':
        return { bg: 'var(--info-50)', text: 'var(--info-600)', border: 'var(--info-100)' };
      case 'purple':
        return { bg: 'var(--purple-50)', text: 'var(--purple-600)', border: 'var(--purple-100)' };
      case 'red':
        return { bg: 'var(--danger-50)', text: 'var(--danger-600)', border: 'var(--danger-100)' };
      case 'slate':
        return { bg: 'var(--slate-100)', text: 'var(--slate-700)', border: 'var(--slate-200)' };
      default:
        return { bg: 'var(--primary-50)', text: 'var(--primary-600)', border: 'var(--primary-100)' };
    }
  };

  const style = getColorStyles();

  return (
    <div 
      className="stat-card" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div 
        className="stat-icon-wrapper" 
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        <Icon size={24} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span className="stat-label">{label}</span>
          {badgeText && (
            <span className={`badge badge-${badgeType}`} style={{ fontSize: '0.65rem' }}>
              {badgeText}
            </span>
          )}
        </div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-hint">{subtext}</div>}
      </div>
    </div>
  );
};
