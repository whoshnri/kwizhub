import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAdminStats, getMaterialEarnings } from "@/app/actions/withdrawals";
import { getPendingCoAuthorRequests } from "@/app/actions/materials";
import { CoAuthorRequests } from "./co-author-requests";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function AdminDashboardPage() {
    const stats = await getAdminStats();
    const earnings = await getMaterialEarnings();
    const pendingRequests = await getPendingCoAuthorRequests();

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your author account
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/referrals">
                        <Button variant="outline">Manage Referrals</Button>
                    </Link>
                    <Link href="/admin/materials/new">
                        <Button>Upload Material</Button>
                    </Link>
                </div>
            </div>

            {/* Co-Author Requests */}
            <CoAuthorRequests requests={pendingRequests} />

            {/* Wallet Card */}
            <Card className="bg-gradient-to-br from-primary to-blue-900 text-white">
                <CardHeader>
                    <CardDescription className="text-blue-100">Wallet Balance</CardDescription>
                    <CardTitle className="text-5xl font-heading">₦{stats.wallet.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <span className="text-blue-100">Available for withdrawal</span>
                        <Link href="/admin/withdrawals">
                            <Button variant="secondary" size="sm">
                                Withdraw
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Earnings</CardDescription>
                        <CardTitle className="text-3xl font-heading">₦{stats.totalEarnings.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">All time</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Materials</CardDescription>
                        <CardTitle className="text-3xl font-heading">{stats.totalMaterials}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Uploaded</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Sales</CardDescription>
                        <CardTitle className="text-3xl font-heading">{stats.totalOrders}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Completed orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Pending Withdrawals</CardDescription>
                        <CardTitle className="text-3xl font-heading">₦{stats.pendingWithdrawals.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Processing</p>
                    </CardContent>
                </Card>
            </div>

            {/* Earnings by Material */}
            <Card>
                <CardHeader>
                    <CardTitle>Earnings by Material</CardTitle>
                    <CardDescription>Performance analytics for your materials</CardDescription>
                </CardHeader>
                <CardContent>
                    {earnings.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">No materials yet</p>
                            <Link href="/admin/materials/new">
                                <Button>Upload Your First Material</Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead className="text-center">Sales</TableHead>
                                    <TableHead className="text-right">Total Earnings</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {earnings.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.course}</TableCell>
                                        <TableCell className="text-center">{item.salesCount}</TableCell>
                                        <TableCell className="text-right font-semibold text-primary">
                                            ₦{item.totalEarnings.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
