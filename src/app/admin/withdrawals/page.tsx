import { getAdminWithdrawals, getAdminStats } from "@/app/actions/withdrawals";
import { WithdrawalsContent } from "./withdrawals-content";

export default async function AdminWithdrawalsPage() {
    const withdrawals = await getAdminWithdrawals();
    const stats = await getAdminStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Withdrawals</h1>
                <p className="text-muted-foreground mt-1">
                    Request and manage your withdrawals
                </p>
            </div>

            <WithdrawalsContent
                withdrawals={withdrawals}
                walletBalance={stats?.wallet ?? 0}
            />
        </div>
    );
}
