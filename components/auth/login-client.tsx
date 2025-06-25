"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { type getDictionary } from "@/get-dictionary";

export default function LoginClient({
  dict,
}: {
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    cause?: unknown;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError({ message: error.message });
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError({ message: "An unexpected error occurred", cause: err });
    } finally {
      setLoading(false);
    }
  };

  // const handleGithubLogin = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "github",
  //       options: {
  //         redirectTo: `${window.location.origin}/auth/callback`,
  //       },
  //     });

  //     if (error) {
  //       setError({ message: error.message });
  //     }
  //   } catch (err) {
  //     setError({ message: "An unexpected error occurred", cause: err });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold ">{dict.auth.login.title}</h1>
          <p className="mt-2 text-sm ">{dict.auth.login.subtitle}</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {dict.auth.login.cardTitle}
            </CardTitle>
            <CardDescription className="text-center">
              {dict.auth.login.cardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{dict.auth.login.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 " />
                  <Input
                    id="email"
                    type="email"
                    placeholder={dict.auth.login.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{dict.auth.login.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 " />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={dict.auth.login.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3  hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600  p-3 rounded-md">
                  {error.message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? dict.auth.login.signingIn
                  : dict.auth.login.signInButton}
              </Button>
            </form>

            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div> */}

            {/* <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleGithubLogin}
              disabled={loading}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button> */}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center ">
              {dict.auth.login.dontHaveAccount}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {dict.auth.login.signUp}
              </Link>
            </div>
            <div className="text-sm text-center ">
              <Link
                href="/auth/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {dict.auth.login.forgotPassword}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
