import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Legal Hub - KwizHub",
    description: "Read our Terms of Service and Privacy Policy to understand how we operate and protect your data.",
};

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
