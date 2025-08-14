import React from "react";
import AppLogoIcon from "./app-logo-icon";

interface FooterProps {
    logo?: {
        src: string;
        alt: string;
        title: string;
    };
    sections?: Array<{
        title: string;
        links: Array<{ name: string; href: string }>;
    }>;
    description?: string;
    copyright?: string;
    legalLinks?: Array<{
        name: string;
        href: string;
    }>;
}

const defaultSections = [
    {
        title: "Services",
        links: [
            { name: "Higher Education", href: "#" },
            { name: "Academic Programs", href: "#" },
            { name: "Quality Assurance", href: "#" },
            { name: "Student Affairs", href: "#" },
        ],
    },
    {
        title: "About CHED",
        links: [
            { name: "Regional Office 12", href: "#" },
            { name: "Leadership", href: "#" },
            { name: "Mission & Vision", href: "#" },
            { name: "Contact Us", href: "#" },
        ],
    },
    {
        title: "Resources",
        links: [
            { name: "Forms & Documents", href: "#" },
            { name: "Guidelines", href: "#" },
            { name: "News & Updates", href: "#" },
            { name: "FAQs", href: "#" },
        ],
    },
];

const defaultLegalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Data Privacy Act", href: "#" },
];

export default function Footer({
    logo = {
        src: "/images/ched-logo.png", // You'll need to add CHED logo
        alt: "CHED Regional Office 12 Logo",
        title: "CHED RO12",
    },
    sections = defaultSections,
    description = "Commission on Higher Education Regional Office 12 - Ensuring quality higher education in SOCCSKSARGEN region.",
    copyright = "© 2025 Commission on Higher Education – Regional Office 12. All rights reserved.",
    legalLinks = defaultLegalLinks,
}: FooterProps) {
    return (
        <footer className="border-t bg-background">
            <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start">
                    {/* Logo and Description Section */}
                    <div className="flex w-full flex-col gap-6 lg:max-w-sm">
                        <div className="flex items-center gap-3">
                            <AppLogoIcon className="h-10 w-10 fill-current text-white" />
                            <div>
                                <h2 className="text-lg font-bold">{logo.title}</h2>
                                <p className="text-sm text-muted-foreground">Regional Office 12</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Links Sections */}
                    <div className="grid w-full gap-8 md:grid-cols-3 lg:gap-12">
                        {sections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-semibold text-foreground">{section.title}</h3>
                                <ul className="space-y-3">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <a
                                                href={link.href}
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section - Copyright and Legal Links */}
                <div className="mt-12 flex flex-col justify-between gap-4 border-t pt-8 text-sm md:flex-row md:items-center">
                    <p className="text-muted-foreground">{copyright}</p>
                    <ul className="flex flex-col gap-4 md:flex-row md:gap-6">
                        {legalLinks.map((link, idx) => (
                            <li key={idx}>
                                <a
                                    href={link.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}
