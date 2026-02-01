import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - KwizHub Support",
    description: "Get in touch with the KwizHub team for support, partnerships, or general inquiries.",
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
