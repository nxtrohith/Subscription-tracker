"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="pt-32 pb-12 px-6">
            <div className="mx-auto max-w-[1200px] text-center">
                {/* Headline */}
                <motion.h1
                    className="text-[42px] md:text-[56px] font-bold leading-tight tracking-tight text-[#000000]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    Manage subscriptions.
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    className="mt-2 text-[18px] md:text-[22px] font-normal text-[#6b6b6b]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                >
                    Take control of your recurring spend.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                    <Link
                        href="/auth"
                        className="inline-flex items-center gap-2 rounded-full bg-[#000000] px-6 py-3 text-sm font-medium text-[#ffffff] transition-all hover:bg-[#1a1a1a] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Get Started
                    </Link>
                </motion.div>

                {/* Hero card with geometric shapes */}
                <motion.div
                    className="mt-12 mx-auto max-w-[900px] aspect-[16/9] rounded-2xl bg-[#f5f5f5] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    {/* Abstract geometric shapes like the Framer design */}
                    {/* Abstract geometric shapes like the Framer design */}
                    <div className="relative w-full h-full">
                        <Image
                            src="https://images.unsplash.com/photo-1740645581672-757325fc75a5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Abstract 3D geometric shapes"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Overlay to ensure text readability if needed, or just for style */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent mix-blend-multiply opacity-20 pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
