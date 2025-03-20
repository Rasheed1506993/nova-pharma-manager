
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <main className={cn(
      "pt-16 pb-6 px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out page-enter",
      "min-h-screen",
      "rtl",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
};

export default PageContainer;
