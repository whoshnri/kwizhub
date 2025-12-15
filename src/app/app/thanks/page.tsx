"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AppDownloadThanks() {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count > 0) {
            const timer = setTimeout(() => setCount(count - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [count]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Thanks for downloading!</h1>
            <p className="text-xl text-muted-foreground mb-8">
                Your download should start in <span className="text-primary font-bold text-2xl px-1">{count > 0 ? count : "now"}</span>
            </p>

            <div className="max-w-md w-full bg-white dark:bg-card p-6 rounded-xl shadow-sm border space-y-4">
                <p className="text-sm text-muted-foreground">
                    If the download doesn't start automatically,
                </p>
                <Button variant="link" className="text-primary" onClick={() => { }}>
                    click here
                </Button>
            </div>

            <div className="mt-12">
                <Link href="/user/materials">
                    <Button variant="outline">
                        Back to My Library
                    </Button>
                </Link>
            </div>
        </div>
    );
}
