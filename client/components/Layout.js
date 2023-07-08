import React, { useEffect } from 'react';
import Sidebar from './SideNav';


const Layout = ({ children, ...pageProps }) => {
    return (
        <div className='flex'>
            <Sidebar userRole={pageProps.role} />
            {children}
        </div>
    );
};

export default Layout;
