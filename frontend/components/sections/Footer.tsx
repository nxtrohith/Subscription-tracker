"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const footerColumns = [
    {
        title: "Company",
        links: [
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Press", href: "#" },
        ],
    },
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Demo", href: "#" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Help Center", href: "#" },
            { label: "Contact", href: "#contact" },
        ],
    },
];

export default function Footer() {
    return (
        <motion.footer
            className="mt-20 bg-[#000000] text-[#ffffff] px-6 py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="mx-auto flex max-w-[1200px] flex-col md:flex-row md:items-start md:justify-between gap-12">
                {/* Logo */}
                <div>
                    <p className="text-lg font-semibold tracking-tight">Draftly®</p>
                </div>

                {/* Link columns */}
                <div className="flex gap-16">
                    {footerColumns.map((column) => (
                        <div key={column.title}>
                            <h4 className="mb-4 text-sm font-semibold text-[#ffffff]">
                                {column.title}
                            </h4>
                            <ul className="flex flex-col gap-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[#999999] transition-colors hover:text-[#ffffff]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </motion.footer>
    );
}
