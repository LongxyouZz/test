"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Globe, Moon, Sun } from "lucide-react";
import UserProfile from "./user-profile";
import { ThemeSwitcher } from "./theme-switcher";
import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { motion } from "framer-motion";

export default function ClientNavbar() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("en");
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          Long Dev
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            About
          </Link>
          <Link
            href="/gallery"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Gallery
          </Link>
          <Link
            href="/news"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            News
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Contact
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {/* Language Toggle */}
          <div className="flex items-center border rounded-md overflow-hidden relative h-8">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-600 w-1/2 z-0"
              animate={{ x: language === "en" ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 z-10 text-sm relative ${language === "en" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("km")}
              className={`px-3 py-1 z-10 text-sm relative ${language === "km" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
            >
              ខ្មែរ
            </button>
          </div>

          {/* Theme Toggle */}
          <ThemeSwitcher />

          {user ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium">
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
