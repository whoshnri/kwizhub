
import { createSessionRecord, validateSessionToken } from "./src/lib/pwa-session";
import prisma from "@/lib/db";


async function main() {
    console.log("Starting API Verification...");

    // 1. Mock creating a user if not exists (or just use a fake ID since we Mock logic somewhat)
    // Actually we need a real user ID for the FK constraint
    const user = await prisma.user.findFirst();
    if (!user) {
        console.log("No users found to test with. Skipping full flow.");
        return;
    }
    console.log(`Testing with user: ${user.email} (${user.id})`);

    // 2. Test Session Creation
    console.log("Creating session record...");
    const { sessionToken, expiresAt } = await createSessionRecord(user.id, "Test Script");
    console.log(`Token created: ${sessionToken.substring(0, 5)}...`);

    // 3. Test Session Validation
    console.log("Validating Token...");
    const result = await validateSessionToken(sessionToken);

    if (!result) {
        console.error("FAILED: Validation returned null");
        process.exit(1);
    }

    if (result.user.id !== user.id) {
        console.error("FAILED: User ID mismatch");
        process.exit(1);
    }

    console.log("SUCCESS: Session validated correctly.");
    console.log("Verified User:", result.user.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
