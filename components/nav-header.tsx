"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { LogOut, Menu, ArrowLeft, Bell, Heart } from "lucide-react";
import { ModeToggle } from "@/components/theme-togle";
import LanguageSwitcher from "@/components/language-switcher";
import { type Locale } from "@/i18n-config";
import Logo from "@/public/Facts Off.png";
import { type getDictionary } from "@/get-dictionary";
interface NavHeaderProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  currentLang: Locale;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

const getUserInitials = (email?: string, fullName?: string) => {
  if (fullName) {
    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return "U";
};

export function NavHeader({
  user,
  currentLang,
  showBackButton = false,
  backHref = "/",
  backLabel = "Back to Dashboard",
  dictionary,
}: NavHeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const userInitials = getUserInitials(
    user.email,
    user.user_metadata?.full_name
  );

  const handleLogout = () => {
    setIsSheetOpen(false);
    // Form submission will be handled by the form element
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Logo and Back Button */}
          <div className="flex items-center gap-4">
            <Link
              href={`/${currentLang}`}
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <Image
                src={Logo}
                alt="Facts Off Logo"
                width={270}
                height={90}
                className="h-14 w-auto"
                priority
              />
            </Link>

            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link href={backHref}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {backLabel}
                </Link>
              </Button>
            )}
          </div>

          {/* Right Section: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher currentLang={currentLang} />
            <ModeToggle />

            {/* User Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${currentLang}/notifications`}>
                    <Bell className="mr-2 h-4 w-4" />
                    {dictionary.nav.notificationSettings}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${currentLang}/set-interests`}>
                    <Heart className="mr-2 h-4 w-4" />
                    {dictionary.nav.interestSettings}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action="/auth/logout" method="post" className="w-full">
                    <button
                      type="submit"
                      className="flex w-full items-center text-left"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {dictionary.nav.logout}
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher currentLang={currentLang} />
            <ModeToggle />

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96 p-6">
                <SheetHeader className="px-0">
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-8 mt-8">
                  {/* User Info */}
                  <div className="flex items-center gap-4 p-6 rounded-lg bg-muted/50">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-base font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-medium text-sm">
                        {user.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-3">
                    {showBackButton && (
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="justify-start h-14 px-6"
                          asChild
                        >
                          <Link href={backHref}>
                            <ArrowLeft className="mr-4 h-5 w-5" />
                            {backLabel}
                          </Link>
                        </Button>
                      </SheetClose>
                    )}

                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="justify-start h-14 px-6"
                        asChild
                      >
                        <Link href={`/${currentLang}/notifications`}>
                          <Bell className="mr-4 h-5 w-5" />
                          Notification Settings
                        </Link>
                      </Button>
                    </SheetClose>

                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="justify-start h-14 px-6"
                        asChild
                      >
                        <Link href={`/${currentLang}/set-interests`}>
                          <Heart className="mr-4 h-5 w-5" />
                          Interest Settings
                        </Link>
                      </Button>
                    </SheetClose>
                  </nav>

                  {/* Logout Button */}
                  <div className="mt-auto pt-8 border-t">
                    <form action="/auth/logout" method="post">
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full justify-start h-14 px-6"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-4 h-5 w-5" />
                        Logout
                      </Button>
                    </form>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
