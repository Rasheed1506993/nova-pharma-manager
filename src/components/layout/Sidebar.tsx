
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  BarChart3, 
  Users, 
  Pill, 
  Settings, 
  Truck,
  CalendarClock,
  Tag
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group",
      "hover:bg-pharma-100 dark:hover:bg-pharma-900/30",
      isActive 
        ? "bg-pharma-100 dark:bg-pharma-900/20 text-pharma-700 dark:text-pharma-400" 
        : "text-gray-600 dark:text-gray-400"
    )}
  >
    <div className={cn(
      "h-7 w-7 flex items-center justify-center rounded-md transition-all duration-200",
      "group-hover:bg-pharma-500 group-hover:text-white",
      "group-hover:shadow-md"
    )}>
      {icon}
    </div>
    <span>{label}</span>
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside 
      className={cn(
        "fixed top-16 bottom-0 left-0 w-64 bg-sidebar z-10",
        "border-r border-gray-200 dark:border-gray-800",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        "dark:bg-gray-900/95 backdrop-blur-sm",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex-1 py-5 px-3 overflow-y-auto">
        <nav className="space-y-1.5">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="لوحة التحكم" />
          <NavItem to="/inventory" icon={<Package size={18} />} label="المخزون" />
          <NavItem to="/sales" icon={<Receipt size={18} />} label="المبيعات" />
          <NavItem to="/reports" icon={<BarChart3 size={18} />} label="التقارير" />
          <NavItem to="/customers" icon={<Users size={18} />} label="العملاء" />
          <NavItem to="/products" icon={<Pill size={18} />} label="المنتجات" />
          <NavItem to="/suppliers" icon={<Truck size={18} />} label="الموردين" />
          <NavItem to="/orders" icon={<CalendarClock size={18} />} label="الطلبات" />
          <NavItem to="/pricing" icon={<Tag size={18} />} label="الأسعار" />
        </nav>
      </div>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <NavItem to="/settings" icon={<Settings size={18} />} label="الإعدادات" />
      </div>
    </aside>
  );
};

export default Sidebar;
