
import React, { useState } from 'react';
import { Bell, Settings, User, Menu, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const PharmacyHeader: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { toast } = useToast();
  const { pharmacy, signOut } = useAuth();
  const [notifications, setNotifications] = useState(3);
  
  const handleNotificationClick = () => {
    toast({
      title: "الإشعارات",
      description: "لديك 3 إشعارات جديدة",
    });
    setNotifications(0);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="z-20 fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center px-4 sm:px-6">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-pharma-600 rounded-md flex items-center justify-center">
              <span className="text-white text-lg font-bold">N</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-pharma-700 dark:text-pharma-300">
                {pharmacy?.name || 'صيدليتي'}
              </h1>
              <p className="text-xs text-gray-500">Nova Pharma</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNotificationClick}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {notifications}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{pharmacy?.owner_name || 'المستخدم'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
              <DropdownMenuItem>إعدادات الصيدلية</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PharmacyHeader;
