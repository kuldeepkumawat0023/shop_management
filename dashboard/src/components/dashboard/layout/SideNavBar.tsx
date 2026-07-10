'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  Package,
  LayoutGrid,
  Tag,
  Warehouse,
  ShoppingCart,
  CircleDollarSign,
  Users,
  Truck,
  Wallet,
  BarChart3,
  Settings,
  ChevronDown,
  Plus,
  X,
  Store,
  CheckCircle2,
  ShoppingBag,
  Building2,
  User,
  ShieldCheck,
  CreditCard,
  Sliders,
  Activity,
  BookOpen,
  Banknote,
  Receipt,
  TrendingUp,
  PauseCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import ShopSwitcher from './ShopSwitcher';

interface NavLink {
  name: string;
  href: string;
  icon: any;
  children?: NavLink[];
}

const erpNavLinks: NavLink[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'POS Billing',
    href: '/pos-group',
    icon: ReceiptText,
    children: [
      { name: 'New Sale', href: '/pos', icon: ShoppingCart },
      { name: 'Hold Bills', href: '/pos/hold-bills', icon: PauseCircle },
      { name: 'Today\'s Sales', href: '/pos/today-sales', icon: Receipt },
    ]
  },
  {
    name: 'Inventory & Products',
    href: '/inventory-group',
    icon: Package,
    children: [
      { name: 'Inventory Status', href: '/inventory', icon: Warehouse },
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Categories', href: '/categories', icon: LayoutGrid },
      { name: 'Brands', href: '/brands', icon: Tag },
    ]
  },
  {
    name: 'Manufacturing',
    href: '/manufacturing-group',
    icon: Building2,
    children: [
      { name: 'Productions', href: '/manufacturing/productions', icon: Activity },
      { name: 'Recipes', href: '/manufacturing/recipes', icon: BookOpen },
    ]
  },
  {
    name: 'Sales & Purchases',
    href: '/sales-group',
    icon: ShoppingCart,
    children: [
      { name: 'Sales', href: '/sales', icon: CircleDollarSign },
      { name: 'Purchases', href: '/purchases', icon: ShoppingCart },
      { name: 'Expenses', href: '/expenses', icon: ReceiptText },
    ]
  },
  {
    name: 'Parties', href: '/parties-group', icon: Users, children: [
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Suppliers', href: '/suppliers', icon: Truck },
    ]
  },
  {
    name: 'HR & Team', href: '/hr-group', icon: User, children: [
      { name: 'Team Members', href: '/team', icon: Users },
      { name: 'System Users', href: '/users', icon: User },
    ]
  },
  {
    name: 'Payroll', href: '/payroll-group', icon: CreditCard, children: [
      { name: 'Staff Salary', href: '/payroll/staff', icon: Users },
      { name: 'Salary Advances', href: '/payroll/advances', icon: Banknote },
    ]
  },
  { name: 'Payments', href: '/payments', icon: Wallet },
  {
    name: 'Reports', href: '/reports-group', icon: BarChart3, children: [
      { name: 'GST Report', href: '/reports/gst', icon: Receipt },
      { name: 'Profit & Loss', href: '/reports/profit', icon: TrendingUp },
    ]
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      { name: 'Store Profile', href: '/settings/store', icon: Building2 },
      { name: 'User Profile', href: '/settings/profile', icon: User },
      { name: 'Roles & Permissions', href: '/settings/roles', icon: ShieldCheck },
      { name: 'Tax & Billing', href: '/settings/billing', icon: CreditCard },
      { name: 'Preferences', href: '/settings/preferences', icon: Sliders },
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
  const [openSubMenus, setOpenSubMenus] = useState<string[]>(['POS Billing']);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus(prev =>
      prev.includes(name) ? [] : [name]
    );
  };

  // Automatically open sub-menu if child route is active
  useEffect(() => {
    erpNavLinks.forEach(item => {
      if (item.children?.some(child => pathname === child.href)) {
        setOpenSubMenus([item.name]);
      }
    });
  }, [pathname]);


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
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
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-on-surface tracking-tight truncate max-w-[140px]">SmartShop</div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Management System</div>
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

        {/* Shop Switcher */}
        <ShopSwitcher />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {erpNavLinks
            .map((link) => {
              const children = link.children;
              const hasChildren = children && children.length > 0;
              const isExpanded = openSubMenus.includes(link.name);
              const isActive = isLinkActive(link.href, pathname, erpNavLinks);
              const isChildActive = children?.some(child => isLinkActive(child.href, pathname, children));
              const Icon = link.icon;

              return (
                <div key={link.name} className="flex flex-col gap-1">
                  {hasChildren ? (
                    <button
                      onClick={() => {
                        const isCurrentlyExpanded = openSubMenus.includes(link.name);
                        if (!isCurrentlyExpanded) {
                          setOpenSubMenus([link.name]);
                          if (!isChildActive && children && children.length > 0) {
                            router.push(children[0].href);
                          }
                        } else {
                          setOpenSubMenus([]);
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
                        "w-4 h-4 transition-transform duration-300",
                        isExpanded ? "rotate-180" : ""
                      )} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => {
                        if (window.innerWidth < 768) onClose();
                      }}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:translate-x-1",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm border-l-4 border-primary"
                          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                      )} />
                      <span className="text-sm font-semibold flex-1">{link.name}</span>
                    </Link>
                  )}

                  {/* Sub-menu Items */}
                  {hasChildren && isExpanded && (
                    <div className="flex flex-col gap-1 ml-4 pl-4 border-l border-outline-variant/10 my-1 animate-in slide-in-from-top-2 duration-300">
                      {children?.map(child => {
                        const isChildActive = isLinkActive(child.href, pathname, children);
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => {
                              if (window.innerWidth < 768) onClose();
                            }}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1",
                              isChildActive
                                ? "text-primary bg-primary/5"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                            )}
                          >
                            <ChildIcon className="w-4 h-4" />
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
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
