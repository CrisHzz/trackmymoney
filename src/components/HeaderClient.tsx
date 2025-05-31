'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderClient() {
  const pathname = usePathname();
  const showHeader = pathname.startsWith('/pages/dashboard') || 
                    pathname.startsWith('/pages/user') || 
                    pathname.startsWith('/pages/butz')||
                    pathname.startsWith('/pages/stats')||
                    pathname.startsWith('/pages/projections')||
                    pathname.startsWith('/pages/expenses')||
                    pathname.startsWith('/pages/income');
  

  return (
    <>
      {showHeader && <Header />}
      <style jsx global>{`
        main {
          padding-top: ${showHeader ? '4rem' : '0'};
        }
      `}</style>
    </>
  );
}