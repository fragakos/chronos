"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/theme-togle";
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
    <header className="shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold  transition-colors"
            >
              Chronikos
            </Link>
            {showBackButton && (
              <Link
                href={backHref}
                className="hidden sm:flex text-sm  transition-colors items-center space-x-1"
              >
                <span>←</span>
                <span>{backLabel}</span>
              </Link>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 " />
              <span className="text-sm  truncate max-w-32">{user.email}</span>
            </div>
            <ModeToggle />
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
          <div className="sm:hidden border-t  ">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Back Button for Mobile */}
              {showBackButton && (
                <Link
                  href={backHref}
                  className="block px-3 py-2 text-sm  rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ← {backLabel}
                </Link>
              )}

              {/* User Info */}
              <div className="px-3 py-2 flex items-center space-x-2 border-b ">
                <User className="h-4 w-4 " />
                <span className="text-sm  truncate">{user.email}</span>
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
