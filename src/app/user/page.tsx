import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/session";
import { getUserPurchasedMaterials, getUserOrders } from "@/app/actions/orders";

export default async function UserDashboardPage() {
    const session = await getUserSession();
    const materials = await getUserPurchasedMaterials();
    const orders = await getUserOrders();

    const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {session?.username}!</h1>
                <p className="text-muted-foreground mt-1">
                    Here&apos;s an overview of your account
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Materials</CardDescription>
                        <CardTitle className="text-4xl">{materials.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Purchased materials</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Transactions</CardDescription>
                        <CardTitle className="text-4xl">{orders.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Completed purchases</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Spent</CardDescription>
                        <CardTitle className="text-4xl">₦{totalSpent.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Materials</CardTitle>
                        <CardDescription>Your recently purchased materials</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {materials.length > 0 ? (
                            <div className="space-y-4">
                                {materials.slice(0, 3).map((material) => (
                                    <div
                                        key={material.id}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{material.name}</p>
                                            <p className="text-sm text-muted-foreground">{material.course}</p>
                                        </div>
                                    </div>
                                ))}
                                <Link href="/user/materials">
                                    <Button variant="outline" className="w-full">
                                        View All Materials
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground mb-4">No materials yet</p>
                                <Link href="/marketplace">
                                    <Button>Browse Marketplace</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your latest purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.slice(0, 3).map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{order.material.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="font-semibold text-primary">
                                            ₦{order.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                                <Link href="/user/transactions">
                                    <Button variant="outline" className="w-full">
                                        View All Transactions
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground">No transactions yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
