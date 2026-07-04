'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Key,
  BarChart3,
  Megaphone,
  Headphones,
  Users,
  Server,
  ShieldAlert,
  ListOrdered,
  Database,
  Settings,
  ChevronDown,
  X,
  Shield,
  Activity,
  Sliders,
  CreditCard,
  BellRing,
  FileText,
  Webhook
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';

interface NavLink {
  name: string;
  href: string;
  icon: any;
  children?: NavLink[];
}

const adminNavLinks: NavLink[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Branches',
    href: '/branches',
    icon: Store,
  },
  {
    name: 'Subscriptions',
    href: '/subscriptions',
    icon: Key,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Marketing',
    href: '/marketing',
    icon: Megaphone,
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: Headphones,
  },
  {
    name: 'Admins',
    href: '/admins',
    icon: Users,
  },
  {
    name: 'System',
    href: '/system',
    icon: Server,
    children: [
      { name: 'Server Health', href: '/system/server-health', icon: Activity },
      { name: 'Security', href: '/system/security', icon: ShieldAlert },
      { name: 'Audit Logs', href: '/system/audit-logs', icon: ListOrdered },
      { name: 'Backups', href: '/system/backups', icon: Database },
    ]
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      { name: 'Platform Config', href: '/settings/platform', icon: Sliders },
      { name: 'Payment Gateways', href: '/settings/payments', icon: CreditCard },
      { name: 'Notifications', href: '/settings/notifications', icon: BellRing },
      { name: 'Tax & Compliance', href: '/settings/compliance', icon: FileText },
      { name: 'API Integrations', href: '/settings/api', icon: Webhook },
    ]
  },
];

const isLinkActive = (href: string, pathname: string, siblings: NavLink[] = []) => {
  if (pathname === href) return true;
  if (href === '/') return false;

  if (pathname.startsWith(href)) {
    const hasBetterSiblingMatch = siblings.some(sib =>
      sib.href !== href &&
      pathname.startsWith(sib.href) &&
      sib.href.length > href.length
    );
    return !hasBetterSiblingMatch;
  }
  return false;
};

interface SideNavBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideNavBar({ isOpen, onClose }: SideNavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>(['System', 'Settings']);

  // Automatically open sub-menu if child route is active
  useEffect(() => {
    adminNavLinks.forEach(item => {
      if (item.children?.some(child => pathname === child.href)) {
        setOpenSubMenus(prev => {
          if (!prev.includes(item.name)) return [...prev, item.name];
          return prev;
        });
      }
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay - Improved blur and background for better focus */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-72 max-w-[85vw] glass-sidebar bg-surface/95 z-50 transition-transform duration-300 ease-in-out flex flex-col p-6 border-r border-outline-variant/30",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>

        {/* Header: Brand + Close */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-button flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-on-surface tracking-tight truncate max-w-[140px]">SmartShop</div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Super Admin</div>
            </div>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden text-on-surface-variant hover:text-error transition-colors"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {adminNavLinks.map((link) => {
            const children = link.children;
            const hasChildren = children && children.length > 0;
            const isExpanded = openSubMenus.includes(link.name);
            const isActive = isLinkActive(link.href, pathname, adminNavLinks);
            const isChildActive = children?.some(child => isLinkActive(child.href, pathname, children));
            const Icon = link.icon;

            return (
              <div key={link.name} className="flex flex-col gap-1">
                {hasChildren ? (
                  <button
                    onClick={() => {
                      const isCurrentlyExpanded = openSubMenus.includes(link.name);
                      if (!isCurrentlyExpanded) {
                        setOpenSubMenus([...openSubMenus, link.name]);
                        if (!isChildActive && children && children.length > 0) {
                          router.push(children[0].href);
                          // Do NOT call onClose here so the submenu stays open and user can click a child link
                        }
                      } else {
                        setOpenSubMenus(openSubMenus.filter(name => name !== link.name));
                      }
                    }}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full cursor-pointer",
                      isChildActive || isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface hover:translate-x-1"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      isChildActive || isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                    )} />
                    <span className="text-sm font-semibold flex-1 text-left">{link.name}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-300 opacity-50",
                      isExpanded ? "rotate-180" : ""
                    )} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onClose} // Closes sidebar on mobile after clicking
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface hover:translate-x-1"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                    )} />
                    <span className="text-sm font-semibold">{link.name}</span>
                  </Link>
                )}

                {hasChildren && (
                  <div className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}>
                    <div className="overflow-hidden">
                      <div className="pl-12 pr-2 py-2 space-y-1 relative before:absolute before:left-[1.6rem] before:top-4 before:bottom-4 before:w-px before:bg-outline-variant/50">
                        {children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildItemActive = pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={onClose} // Closes sidebar on mobile after clicking child link
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative",
                                isChildItemActive
                                  ? "text-primary font-semibold bg-primary/5 before:absolute before:left-[-1.1rem] before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary"
                                  : "text-on-surface-variant font-medium hover:text-on-surface hover:bg-surface-container-high hover:translate-x-1"
                              )}
                            >
                              <ChildIcon className="w-4 h-4 opacity-70" />
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
