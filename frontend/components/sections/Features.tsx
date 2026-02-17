"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface FeatureCardProps {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    reverse?: boolean;
    index: number;
}

function FeatureCard({ title, description, image, imageAlt, reverse, index }: FeatureCardProps) {
    return (
        <motion.div
            className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {/* Text content */}
            <div className="flex flex-1 flex-col justify-center py-4">
                <h3 className="text-[28px] md:text-[36px] font-bold text-[#000000] leading-tight">
                    {title}
                </h3>
                <p className="mt-4 text-[16px] md:text-[18px] leading-relaxed text-[#6b6b6b] max-w-[400px]">
                    {description}
                </p>
            </div>

            {/* Image card */}
            <div className="flex flex-1 w-full relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-[#f5f5f5]">
                <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
        </motion.div>
    );
}

const features = [
    {
        title: "Unified dashboard.",
        description:
            "View and manage all your subscriptions in one place to save time. Track everything from a single, intuitive interface.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
        imageAlt: "Unified dashboard analytics interface",
        reverse: false,
    },
    {
        title: "Smart reminders.",
        description:
            "Never miss a renewal—get automatic alerts for upcoming charges. Stay on top of your payments with timely notifications.",
        image: "https://plus.unsplash.com/premium_photo-1681487767138-ddf2d67b35c1?q=80&w=2555&auto=format&fit=crop",
        imageAlt: "3D notification bell icon",
        reverse: true,
    },
    {
        title: "Spending insights.",
        description:
            "Track your subscription expenses with clear visual reports. Understand exactly where your money goes every month.",
        image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2670&auto=format&fit=crop",
        imageAlt: "Financial growth chart and insights",
        reverse: false,
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 px-6 md:px-12">
            <div className="mx-auto max-w-[1100px] flex flex-col gap-24">
                {features.map((feature, i) => (
                    <FeatureCard key={feature.title} {...feature} index={i} />
                ))}
            </div>
        </section>
    );
}
