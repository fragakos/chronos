"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X } from "lucide-react";

interface NavHeaderProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function NavHeader({
  user,
  showBackButton = false,
  backHref = "/",
  backLabel = "Back to Dashboard",
}: NavHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              Chronikos
            </Link>
            {showBackButton && (
              <Link
                href={backHref}
                className="hidden sm:flex text-sm text-gray-600 hover:text-gray-900 transition-colors items-center space-x-1"
              >
                <span>←</span>
                <span>{backLabel}</span>
              </Link>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 truncate max-w-32">
                {user.email}
              </span>
            </div>
            <form action="/auth/logout" method="post">
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Back Button for Mobile */}
              {showBackButton && (
                <Link
                  href={backHref}
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ← {backLabel}
                </Link>
              )}

              {/* User Info */}
              <div className="px-3 py-2 flex items-center space-x-2 border-b border-gray-100">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 truncate">
                  {user.email}
                </span>
              </div>

              {/* Logout Button */}
              <form action="/auth/logout" method="post" className="px-3 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="w-full justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
