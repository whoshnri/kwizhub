import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
    title: "KwizHub App - Academic Materials Marketplace",
    description: "Find and share quality academic materials, past questions, and study resources.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
        <Navbar/>
        { children }
        <Footer/>
        </>

    );
}
