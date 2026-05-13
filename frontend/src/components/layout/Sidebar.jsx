import React from 'react';
import { Bot, Server, Zap, ChevronRight, LogOut, UserCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { id: 'list', label: 'Mes Bots', icon: Server, description: 'Gérez vos assistants' },
];

export default function Sidebar({ currentView, setCurrentView, botsCount = 0, adminUser, onLogout }) {
  return (
    <aside className="sidebar">
      {/* Logo & Branding */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Bot size={22} color="white" />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">BotBuilder</span>
          <span className="sidebar-brand-sub">Marsa Maroc Platform</span>
        </div>
      </div>

      {/* Status pill */}
      <div className="sidebar-status-pill">
        <Zap size={12} className="sidebar-status-icon" />
        <span>Système opérationnel</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">Navigation</span>
        {navItems.map(({ id, label, icon: Icon, description }) => (
          <button
            key={id}
            className={cn('sidebar-nav-item', currentView === id && 'sidebar-nav-item--active')}
            onClick={() => setCurrentView(id)}
          >
            <div className="sidebar-nav-icon">
              <Icon size={18} />
            </div>
            <div className="sidebar-nav-text">
              <span className="sidebar-nav-item-label">{label}</span>
              <span className="sidebar-nav-item-desc">{description}</span>
            </div>
            {currentView === id && <ChevronRight size={14} className="sidebar-nav-chevron" />}
          </button>
        ))}
      </nav>

      {/* Footer stats */}
      <div className="sidebar-footer" style={{ flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', width: '100%' }}>
          <div className="sidebar-stat">
            <span className="sidebar-stat-value">{botsCount}</span>
            <span className="sidebar-stat-label">Bots actifs</span>
          </div>
          <div className="sidebar-stat-divider" />
          <div className="sidebar-stat">
            <span className="sidebar-stat-value" style={{ color: 'var(--success)' }}>Online</span>
            <span className="sidebar-stat-label">API Status</span>
          </div>
        </div>

        {/* Admin user + logout */}
        {adminUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-3)',
            width: '100%',
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}>
            <UserCircle2 size={18} style={{ color: 'var(--accent-400)', flexShrink: 0 }} />
            <span style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {adminUser.email || adminUser.name || 'Admin'}
            </span>
            <button
              onClick={onLogout}
              title="Se déconnecter"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
