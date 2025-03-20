
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import PageContainer from './PageContainer';

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        {children}
      </PageContainer>
    </div>
  );
};

export default Navbar;
