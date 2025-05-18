"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
    IconMenu2,
    IconX,
    IconUserCircle
} from "@tabler/icons-react";
import UnderlineLink from './animations/UnderlineLink';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

const Navbar = () => {
  const [isUserIconOpen, setIsSettingsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Sessions', path: '/sessions' },
    { name: 'Goals', path: '/goals' },
    { name: 'Analytics', path: '/analytics' },
  ];

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 0) {
        // At the top of the page
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Get user's avatar URL from auth provider
  const getAvatarUrl = () => {
    if (!user) return null;
    
    // Check for Google avatar
    if (user.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    
    // Check for GitHub avatar
    if (user.user_metadata?.github?.avatar_url) {
      return user.user_metadata.github.avatar_url;
    }

    return null;
  };

  const handleSignOut = async () => {
    try {
      console.log(signOut)
      await signOut();
      // Close any open menus
      setIsSettingsOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`
        bg-bg1 fixed top-0 left-0 right-0 z-50
        border-b border-[#c6d2d9] px-0
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        hidden md:block
      `}>
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div>
              <UnderlineLink 
                className="mr-4 font-bold text-xl text-main" 
                href="/" 
                textColor="text-main-2"
              >
                Stydis
              </UnderlineLink>
            </div>

            {/* Desktop Navigation Links */}
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <UnderlineLink
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.path
                      ? 'bg-mbg-3 text-main'
                      : 'hover:bg-mbg-3 hover:text-white'
                  }`}
                  textColor="text-1"
                >
                  {item.name}
                </UnderlineLink>
              ))}
            </div>

            {/* Desktop User Icon Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isUserIconOpen)}
                className="flex items-center focus:outline-none"
              >
                {getAvatarUrl() ? (
                  <img
                    src={getAvatarUrl()}
                    alt="Account"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <IconUserCircle className="h-8 w-8 text-main" />
                )}
              </button>
                
              {/* Dropdown Menu */}
              {isUserIconOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-mbg-2 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-main hover:bg-mbg-3"
                      role="menuitem"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-main hover:bg-mbg-3"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md text-main hover:bg-mbg-3 focus:outline-none"
      >
        {isMobileMenuOpen ? (
          <IconX className="h-6 w-6" />
        ) : (
          <IconMenu2 className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-mbg-1">
          <div className="pt-20 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path
                    ? 'bg-mbg-3 text-main'
                    : 'text-acc-2 hover:bg-mbg-3 hover:text-main'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-acc-2 hover:bg-mbg-3 hover:text-main"
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-acc-2 hover:bg-mbg-3 hover:text-main"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;