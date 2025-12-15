import { Suspense } from "react";
import { getMyReferralCodes } from "@/app/actions/referrals";
import { ReferralManager } from "./referral-manager";
import { getAdminMaterials } from "@/app/actions/withdrawals";

export default async function ReferralsPage() {
    const codes = await getMyReferralCodes();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Referral Codes</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your referral codes and track earnings.
                </p>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <ReferralManager codes={codes} />
            </Suspense>
        </div>
    );
}
