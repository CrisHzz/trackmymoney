"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  User,
  ChevronDown,
  Menu,
  X,
  Squirrel,
  BarChart
} from 'lucide-react';
import UserProfile from './UserProfile'; // Importamos el componente UserProfile

const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cambiar el estilo del header al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enlaces de navegación
  const navLinks = [
    { 
      name: 'Dashboard', 
      href: '/pages/dashboard', 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    },
    { 
      name: 'Proyecciones', 
      href: '/pages/projections', 
      icon: <TrendingUp className="w-4 h-4" /> 
    },
    { 
      name: 'Stats', 
      href: '/pages/stats', 
      icon: <BarChart className="w-4 h-4" /> 
    },
    { 
      name: 'Butz', 
      href: '/pages/butz', 
      icon: <Squirrel className="w-4 h-4" /> 
    },
    { 
      name: 'Perfil', 
      href: '/pages/user', 
      icon: <User className="w-4 h-4" /> 
    },
    
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/10 backdrop-blur-md shadow-lg border-b border-white/10' 
          : 'bg-gradient-to-br from-purple-900/80 via-violet-800/80 to-emerald-500/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="bg-gradient-to-br from-emerald-400 to-purple-500 p-2 rounded-lg"
            >
              <span className="text-white text-xl font-bold">💸</span>
            </motion.div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
              TrackMyMoney
            </span>
          </Link>

          {/* Navegación escritorio */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                    pathname === link.href 
                      ? 'bg-gradient-to-r from-emerald-500 to-purple-600 text-white' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                  {link.name === 'Perfil' && <ChevronDown className="w-4 h-4 ml-1" />}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* UserProfile - Visible solo en escritorio */}
          <div className="hidden md:flex items-center">
            <UserProfile />
          </div>

          {/* Botón menú móvil */}
          <button 
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gradient-to-br from-purple-900/90 via-violet-800/90 to-emerald-500/90 backdrop-blur-md border-b border-white/10"
        >
          {/* UserProfile en móvil */}
          <div className="py-3 px-6 border-b border-white/10">
            <UserProfile />
          </div>
          
          <nav className="flex flex-col py-3 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-2 py-3 px-4 rounded-lg ${
                  pathname === link.href 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/80'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;