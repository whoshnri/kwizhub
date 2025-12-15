import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Smartphone, BookOpen, UserCheck, WifiOff } from "lucide-react";
import Image from "next/image";

export default function AppLandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-32">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text Content */}
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Your Library, <br />
                                <span className="text-primary">Anywhere, Securely.</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                                The KwizHub App gives students offline access to their purchased materials while ensuring industry-leading content protection for authors.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
                                    <div className="w-full sm:w-auto">
                                        {/* <PwaInstallPrompt /> */}
                                    </div>
                                    <Link href="/pwa" className="w-full sm:w-auto">
                                        <Button variant="secondary" size="lg" className="w-full text-lg h-10 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                            Open Web Reader
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Mock Phone UI */}
                        <div className="flex-1 w-full max-w-md relative perspective-1000 group">
                            <div className="relative w-[300px] h-[600px] mx-auto bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-12">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-xl z-20"></div>

                                {/* Screen Content */}
                                <div className="w-full h-full bg-white dark:bg-gray-950 flex flex-col relative">
                                    {/* App Header */}
                                    <div className="px-6 pt-12 pb-4 bg-primary text-white">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg">My Library</span>
                                            <UserCheck className="h-5 w-5 opacity-80" />
                                        </div>
                                        <p className="text-xs text-primary-foreground/80 mt-1">Hello, Henry</p>
                                    </div>

                                    {/* Books Grid */}
                                    <div className="p-4 grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="space-y-2 opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm w-full relative group/book overflow-hidden">
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                        <BookOpen className="h-8 w-8" />
                                                    </div>
                                                    {i === 1 && (
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                                                            <div className="flex items-center gap-1 text-white text-xs font-medium">
                                                                <WifiOff className="h-3 w-3" />
                                                                Offline Ready
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                                                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Floating Action Button */}
                                    <div className="absolute bottom-6 right-6 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Blobs */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute bottom-10 -left-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why use the App?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Designed for providing a seamless reading experience while protecting intellectual property.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="bg-blue-50 dark:bg-blue-900/10 border-none shadow-none">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mx-auto">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold">DRM Protection</h3>
                                <p className="text-muted-foreground">
                                    Advanced encryption ensures that content cannot be screenshotted, copied, or shared illegally.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 dark:bg-green-900/10 border-none shadow-none">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center mx-auto">
                                    <WifiOff className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold">Offline Access</h3>
                                <p className="text-muted-foreground">
                                    Download once, read anywhere. Perfect for studying on the go without data.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-purple-50 dark:bg-purple-900/10 border-none shadow-none">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                                    <Smartphone className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold">Secure Reader</h3>
                                <p className="text-muted-foreground">
                                    A built-in PDF reader optimized for mobile screens with night mode and annotation support.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">How to get started</h2>
                    <div className="max-w-3xl mx-auto space-y-8">
                        {[
                            { step: 1, title: "Download the App", desc: "Available for Android and iOS (Coming Soon)" },
                            { step: 2, title: "Log In", desc: "Use your KwizHub student credentials." },
                            { step: 3, title: "Sync Library", desc: "Your purchased books will appear automatically." },
                            { step: 4, title: "Read Offline", desc: "Tap to download and read securely." }
                        ].map((item) => (
                            <div key={item.step} className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <h4 className="text-xl font-medium mb-1">{item.title}</h4>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
