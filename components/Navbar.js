"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
    IconMenu2,
    IconX,
    IconUserCircle,
    IconSettings,
    IconLogout
} from "@tabler/icons-react";
import UnderlineLink from './animations/UnderlineLink';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isUserIconOpen, setIsSettingsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Sessions', href: '/sessions' },
    { name: 'Goals', href: '/goals' },
    { name: 'Topics', href: '/topics' },
    { name: 'Analytics', href: '/analytics' },
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
        bg-black fixed top-0 left-0 right-0 z-[50]
        border-b border-white px-0
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        hidden md:block
      `}>
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-[65px]">
            {/* Logo */}
            <div>
              <UnderlineLink 
                className="mr-4 font-bold text-xl text-white" 
                href="/" 
                textColor="text-white"
              >
                Stydis
              </UnderlineLink>
            </div>

            {/* Desktop Navigation Links */}
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <UnderlineLink
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-pink'
                      : 'hover:text-pink'
                  }`}
                  textColor="text-1"
                >
                  {item.name}
                </UnderlineLink>
              ))}
            </div>

            {/* Desktop User Icon Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center focus:outline-none"
              >
                {getAvatarUrl() ? (
                  <Image
                    src={getAvatarUrl()}
                    alt="Account"
                    width={32}
                    height={32}
                    className="rounded-full object-cover transition-transform duration-200 group-hover:scale-110"
                  />
                ) : (
                  <IconUserCircle className="h-8 w-8 text-white transition-transform duration-200 group-hover:scale-110" />
                )}
              </button>
                
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform origin-top-right">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-black-2 transition-colors duration-200"
                    role="menuitem"
                  >
                    <IconSettings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-black-2 transition-colors duration-200"
                    role="menuitem"
                  >
                    <IconLogout className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-md text-main hover:bg-black-black focus:outline-none"
      >
        {isMobileMenuOpen ? (
          <IconX className="h-6 w-6" />
        ) : (
          <IconMenu2 className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black-black">
          <div className="pt-20 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'bg-black-black text-white'
                    : 'text-white hover:bg-black-black hover:text-pink'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-black-mbg-black-3 hover:text-pink"
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-pink hover:bg-black-mbg-black-3 hover:text-pink"
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