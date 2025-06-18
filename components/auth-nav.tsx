"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogOut, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function AuthNav() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600 hidden sm:inline">
            {user.email}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <Link href="/auth/login">
        <Button variant="outline" size="sm">
          <LogIn className="mr-2 h-4 w-4" />
          Sign in
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Sign up
        </Button>
      </Link>
    </div>
  );
}
