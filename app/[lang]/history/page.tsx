import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Calendar, Star, Bookmark } from "lucide-react";

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Your Reading History</h2>
            <p className="">
              Track the historical facts you&apos;ve discovered and your
              engagement
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm ">Total Facts Read</p>
                    <p className="text-2xl font-bold ">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm ">Average Rating</p>
                    <p className="text-2xl font-bold ">-</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Bookmark className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm ">Bookmarked</p>
                    <p className="text-2xl font-bold ">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm ">Reading Streak</p>
                    <p className="text-2xl font-bold ">0 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder for History List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Facts</CardTitle>
              <CardDescription>Facts you&apos;ve read recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium  mb-2">No Facts Yet</h3>
                <p className=" mb-6">
                  Once you start reading historical facts, they&apos;ll appear
                  here with your ratings and engagement.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" asChild>
                    <Link href="/">Back to Dashboard</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/random-fact">Get Your First Fact</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <Card>
            <CardHeader>
              <CardTitle>History Features</CardTitle>
              <CardDescription>
                What you&apos;ll be able to do with your reading history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium ">Reading Progress</h3>
                  <ul className="space-y-2 text-sm ">
                    <li>• Track facts read by date and time</li>
                    <li>• View reading streaks and statistics</li>
                    <li>• See your most active reading periods</li>
                    <li>• Monitor progress across different categories</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium ">Engagement Tracking</h3>
                  <ul className="space-y-2 text-sm ">
                    <li>• Rate facts from 1-5 stars</li>
                    <li>• Bookmark your favorite facts</li>
                    <li>• View average ratings by category</li>
                    <li>• Export your reading history</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Options (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Filter & Search</CardTitle>
              <CardDescription>
                Find specific facts from your history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">By Category</h4>
                  <p className="text-sm ">Filter by historical topics</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">By Rating</h4>
                  <p className="text-sm ">Show facts by your ratings</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">By Date</h4>
                  <p className="text-sm ">Browse by reading date</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
