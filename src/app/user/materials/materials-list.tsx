"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

type Material = {
    id: string;
    name: string;
    course: string;
    courseCode: string;
    price: number;
    admin: {
        name: string;
    };
};

export function MaterialsList({ materials }: { materials: Material[] }) {
    const router = useRouter();

    if (materials.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">You haven&apos;t purchased any materials yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
                <Card key={material.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg line-clamp-2">{material.name}</CardTitle>
                            <Badge variant="secondary" className="shrink-0">
                                {material.course}
                            </Badge>
                        </div>
                        <CardDescription>By {material.admin.name}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">
                                {material.courseCode}
                            </Badge>
                        </div>
                    </CardContent>

                    <CardContent className="pt-0">
                        <Button
                            onClick={() => router.push(`/app`)}
                            className="w-full"
                        >
                            Read On the App
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
