"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="text-[28px] font-bold tracking-tight text-[#000000]">
                    Draftly®
                </Link>

                {/* Nav links + auth */}
                <div className="flex items-center gap-8">
                    <Link
                        href="/#features"
                        className="text-[16px] font-medium text-[#6b6b6b] transition-colors hover:text-[#000000]"
                    >
                        Features
                    </Link>

                    <SignedOut>
                        <Link
                            href="/auth"
                            className="text-[16px] font-medium text-[#6b6b6b] transition-colors hover:text-[#000000]"
                        >
                            Sign In
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-8 w-8",
                                },
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
