"use client";

import Navbar from "@/components/sections/Navbar";
import { motion } from "framer-motion";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { syncUser } from "@/lib/api";

export default function AuthPage() {
  const { isSignedIn, getToken } = useAuth();
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");

  useEffect(() => {
    if (isSignedIn && syncStatus === "idle") {
      setSyncStatus("syncing");
      getToken()
        .then((token) => {
          if (!token) {
            throw new Error("No authentication token available");
          }
          return syncUser(token);
        })
        .then(() => {
        .then(() => {
          setSyncStatus("synced");
          console.log("User synced to database");
        })
            .catch((error) => {
              setSyncStatus("error");
              console.error("Failed to sync user:", error);
            });
        }
  }, [isSignedIn, syncStatus, getToken]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa]">
      <Navbar />

      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#e0e0e0] to-[#f5f5f5] opacity-60 blur-3xl"
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-[#d4d4d4] to-[#ebebeb] opacity-50 blur-3xl"
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -25, 0],
            scale: [1, 0.92, 1.06, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 left-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-[#e8e8e8] to-[#f0f0f0] opacity-40 blur-3xl"
          animate={{
            x: [0, 30, -40, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        {/* Signed Out view — show auth card */}
        <SignedOut>
          <motion.div
            className="w-full max-w-[460px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Glass card */}
            <div className="rounded-3xl border border-[#e5e5e5] bg-white/70 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              {/* Brand */}
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Link
                  href="/"
                  className="inline-block text-[32px] font-bold tracking-tight text-[#000000]"
                >
                  Draftly®
                </Link>
                <p className="mt-2 text-[15px] font-normal text-[#6b6b6b]">
                  Sign in to manage your subscriptions
                </p>
              </motion.div>

              {/* Divider */}
              <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#e0e0e0] to-transparent" />

              {/* Auth buttons */}
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                {/* Sign In — primary */}
                <SignInButton mode="redirect">
                  <button className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-[#000000] px-6 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-lg active:scale-[0.98]">
                    <span className="relative z-10">Sign In</span>
                    {/* Shine sweep */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </button>
                </SignInButton>

                {/* Sign Up — secondary */}
                <SignUpButton mode="redirect">
                  <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#000000] bg-transparent px-6 py-3.5 text-[15px] font-medium text-[#000000] transition-all duration-300 hover:bg-[#000000] hover:text-white hover:shadow-lg active:scale-[0.98]">
                    Create an Account
                  </button>
                </SignUpButton>
              </motion.div>

              {/* Footer text */}
              <motion.p
                className="mt-8 text-center text-[13px] text-[#999999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                By continuing, you agree to Draftly&apos;s{" "}
                <span className="cursor-pointer underline underline-offset-2 transition-colors hover:text-[#000000]">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="cursor-pointer underline underline-offset-2 transition-colors hover:text-[#000000]">
                  Privacy Policy
                </span>
              </motion.p>
            </div>

            {/* Subtle glow under the card */}
            <div className="mx-auto mt-[-2px] h-6 w-3/4 rounded-b-3xl bg-gradient-to-b from-[#000000]/[0.03] to-transparent blur-sm" />
          </motion.div>
        </SignedOut>

        {/* Signed In view — dashboard redirect / welcome */}
        <SignedIn>
          <motion.div
            className="w-full max-w-[460px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="rounded-3xl border border-[#e5e5e5] bg-white/70 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              {/* Welcome header */}
              <div className="mb-6 flex flex-col items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-20 w-20",
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h1 className="text-[28px] font-bold tracking-tight text-[#000000]">
                    Welcome back!
                  </h1>
                  <p className="mt-1 text-[15px] text-[#6b6b6b]">
                    You&apos;re signed in to Draftly
                  </p>
                </motion.div>
              </div>

              {/* Divider */}
              <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-[#e0e0e0] to-transparent" />

              {/* Quick actions */}
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <Link
                  href="/dashboard"
                  className="group flex w-full items-center justify-between rounded-2xl border border-[#ebebeb] bg-white/50 px-5 py-4 transition-all duration-300 hover:border-[#d4d4d4] hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-lg transition-colors group-hover:bg-[#000000] group-hover:text-white">
                      📊
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#000000]">
                        Dashboard
                      </p>
                      <p className="text-[12px] text-[#999999]">
                        View your subscriptions
                      </p>
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 text-[#999999] transition-transform group-hover:translate-x-1 group-hover:text-[#000000]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <Link
                  href="/subscriptions/new"
                  className="group flex w-full items-center justify-between rounded-2xl border border-[#ebebeb] bg-white/50 px-5 py-4 transition-all duration-300 hover:border-[#d4d4d4] hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f5f5] text-lg transition-colors group-hover:bg-[#000000] group-hover:text-white">
                      ➕
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#000000]">
                        Add Subscription
                      </p>
                      <p className="text-[12px] text-[#999999]">
                        Track a new recurring expense
                      </p>
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 text-[#999999] transition-transform group-hover:translate-x-1 group-hover:text-[#000000]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </SignedIn>

        {/* Floating decorative elements */}
        <motion.div
          className="pointer-events-none absolute bottom-12 left-12 hidden lg:block"
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-16 w-16 rounded-2xl border border-[#e5e5e5] bg-white/40 shadow-sm backdrop-blur-sm" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute top-32 right-20 hidden lg:block"
          animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <div className="h-12 w-12 rounded-full border border-[#e5e5e5] bg-white/40 shadow-sm backdrop-blur-sm" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute bottom-32 right-32 hidden lg:block"
          animate={{ y: [0, -8, 0], rotate: [0, 12, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="h-20 w-20 rotate-45 rounded-2xl border border-[#e5e5e5] bg-white/30 shadow-sm backdrop-blur-sm" />
        </motion.div>
      </div>
    </main>
  );
}