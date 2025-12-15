import { getUserOrders } from "@/app/actions/orders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function UserTransactionsPage() {
    const orders = await getUserOrders();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Transaction History</h1>
                <p className="text-muted-foreground mt-1">
                    View all your purchases
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>
                        {orders.length} transaction{orders.length !== 1 ? "s" : ""} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <p className="text-center py-8 text-muted-foreground">
                            No transactions yet.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.material.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.material.course}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {order.paymentRef}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === "COMPLETED"
                                                        ? "default"
                                                        : order.status === "FAILED"
                                                            ? "destructive"
                                                            : "secondary"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ₦{order.amount.toLocaleString()}
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
