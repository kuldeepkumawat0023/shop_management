'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, Store, CreditCard, BarChart3,
  Settings, LogOut, Shield, Bell
} from 'lucide-react';

const nav = [
  { label: 'Dashboard',    href: '/dashboard',     icon: LayoutDashboard },
  { label: 'Users',        href: '/users',         icon: Users },
  { label: 'Shops',        href: '/shops',         icon: Store },
  { label: 'Plans',        href: '/plans',         icon: CreditCard },
  { label: 'Analytics',    href: '/analytics',     icon: BarChart3 },
  { label: 'Settings',     href: '/settings',      icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="flex items-center gap-3">
          <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>SmartShop</div>
            <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Super Admin</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className={`nav-item ${pathname.startsWith(href) ? 'active' : ''}`}>
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--surface-border)' }}>
        <button className="nav-item w-full" style={{ color: 'var(--error)' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export function Topbar({ title }: { title: string }) {
  return (
    <header className="topbar">
      <h1 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h1>
      <div className="flex items-center gap-3">
        <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '9px' }}>
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="avatar" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>SA</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Super Admin</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>admin@smartshop.dev</div>
          </div>
        </div>
      </div>
    </header>
  );
}
