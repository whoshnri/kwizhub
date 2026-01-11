import { Suspense } from "react";
import { getAdminTransactions } from "@/app/actions/transactions";
import { getAdminMaterials } from "@/app/actions/withdrawals";
import { TransactionsView } from "./transactions-view";
import { $Enums } from "@/generated/prisma/client";

export default async function AdminTransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const type = params.type as $Enums.TransactionType | undefined;
    const materialId = params.materialId;
    const startDate = params.startDate;
    const endDate = params.endDate;

    const transactions = await getAdminTransactions({ 
        type, 
        materialId,
        startDate,
        endDate,
    });
    const materials = await getAdminMaterials(); // For filter dropdown

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-heading">Transactions</h1>
                <p className="text-muted-foreground mt-1">
                    View and filter your sales & earning history.
                </p>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <TransactionsView
                    transactions={transactions}
                    materials={materials}
                    currentFilters={{ type, materialId, startDate, endDate }}
                />
            </Suspense>
        </div>
    );
}
