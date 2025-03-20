
import React, { useState } from 'react';
import PharmacyHeader from './PharmacyHeader';
import Sidebar from './Sidebar';
import PageContainer from './PageContainer';

interface NavbarProps {
  children: React.ReactNode;
}

const PharmacyNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="bg-background">
      <PharmacyHeader toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        {children}
      </PageContainer>
    </div>
  );
};

export default PharmacyNavbar;
