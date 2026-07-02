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
  TrendingUp
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';

interface NavLink {
  name: string;
  href: string;
  icon: any;
  children?: NavLink[];
}

const erpNavLinks: NavLink[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'POS Billing', href: '/pos', icon: ReceiptText },
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
  { name: 'Parties', href: '/parties-group', icon: Users, children: [
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Suppliers', href: '/suppliers', icon: Truck },
  ]},
  { name: 'HR & Team', href: '/hr-group', icon: User, children: [
      { name: 'Team Members', href: '/team', icon: Users },
      { name: 'System Users', href: '/users', icon: User },
  ]},
  { name: 'Payroll', href: '/payroll-group', icon: CreditCard, children: [
      { name: 'Staff Salary', href: '/payroll/staff', icon: Users },
      { name: 'Salary Advances', href: '/payroll/advances', icon: Banknote },
  ]},
  { name: 'Payments', href: '/payments', icon: Wallet },
  { name: 'Reports', href: '/reports-group', icon: BarChart3, children: [
      { name: 'GST Report', href: '/reports/gst', icon: Receipt },
      { name: 'Profit & Loss', href: '/reports/profit', icon: TrendingUp },
  ]},
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

// Mock Data for workspaces
const mockCompanies = [
  { _id: '1', name: 'Green Mart - Main Branch', logo: null },
  { _id: '2', name: 'Green Mart - Warehouse', logo: null },
  { _id: '3', name: 'Green Mart - North Zone', logo: null },
];

export default function SideNavBar({ isOpen, onClose }: SideNavBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [companies, setCompanies] = useState<any[]>(mockCompanies);
  const [activeCompany, setActiveCompany] = useState<any>(mockCompanies[0]);

  const handleSwitchCompany = async (company: any) => {
    if (company._id === activeCompany?._id) {
      setIsCompanyDropdownOpen(false);
      return;
    }
    setActiveCompany(company);
    setIsCompanyDropdownOpen(false);
  };

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  // Automatically open sub-menu if child route is active
  useEffect(() => {
    erpNavLinks.forEach(item => {
      if (item.children?.some(child => pathname === child.href)) {
        setOpenSubMenus(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
      }
    });
  }, [pathname]);

  const companyName = activeCompany?.name || 'SmartShop Admin';

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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20 shrink-0">
              <ShoppingBag className="w-5 h-5 fill-current" />
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

        {/* Company Switcher Dropdown */}
        {companies.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-xl hover:bg-surface-container-high transition-all cursor-pointer",
                isCompanyDropdownOpen ? "ring-2 ring-primary/20 border-primary/30" : ""
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {activeCompany?.logo ? (
                    <img src={activeCompany.logo} alt={companyName} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <Store size={14} />
                  )}
                </div>
                <span className="text-sm font-bold truncate text-on-surface">{companyName}</span>
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  "text-on-surface-variant transition-transform duration-300 shrink-0",
                  isCompanyDropdownOpen ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Dropdown Panel */}
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isCompanyDropdownOpen ? "max-h-72 opacity-100 mt-2" : "max-h-0 opacity-0"
            )}>
              <div className="py-2 bg-surface-container-high/60 border border-outline-variant/10 rounded-xl space-y-0.5 overflow-y-auto max-h-64">
                <div className="px-4 py-2 border-b border-outline-variant/10">
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Switch Workspace</p>
                </div>

                {companies.map((company: any) => (
                  <button
                    key={company._id}
                    onClick={() => handleSwitchCompany(company)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer",
                      company._id === activeCompany?._id
                        ? "text-primary bg-primary/5"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                    )}
                  >
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 overflow-hidden">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black text-primary">{company.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium truncate flex-1">{company.name}</span>
                    {company._id === activeCompany?._id && (
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                    )}
                  </button>
                ))}

                {/* Add New Company */}
                <div className="px-2 pt-1.5 mt-1 border-t border-outline-variant/10">
                  <button
                    onClick={() => {
                      setIsCompanyDropdownOpen(false);
                      // Trigger Create Company Modal later
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-primary hover:bg-primary/5 transition-colors rounded-lg group cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <Plus size={14} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest truncate">Add Branch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                        toggleSubMenu(link.name);
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
