import prisma from "@/lib/db";
import bcrypt from "bcrypt";

async function main() {
    console.log("🌱 Seeding database...");

    // Create Admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.admin.upsert({
        where: { email: "admin@kwizhub.com" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@kwizhub.com",
            username: "admin",
            passwordHash: adminPassword,

        },
    });
    console.log("✅ Created admin:", admin.email);

    // Create Users
    const userPassword = await bcrypt.hash("user123", 10);
    const user1 = await prisma.user.upsert({
        where: { email: "john@example.com" },
        update: {},
        create: {
            email: "john@example.com",
            username: "johndoe",
            passwordHash: userPassword,
            
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: "jane@example.com" },
        update: {},
        create: {
            email: "jane@example.com",
            username: "janedoe",
            passwordHash: userPassword,
        },
    });
    console.log("✅ Created users:", user1.email, user2.email);

    // Create Co-Author Admin
    const coAuthor = await prisma.admin.upsert({
        where: { email: "drsmith@kwizhub.com" },
        update: {},
        create: {
            name: "Dr. Smith",
            email: "drsmith@kwizhub.com",
            username: "drsmith",
            passwordHash: adminPassword,
            wallet: {
                create: {
                    balance: 0
                }
            }
        },
    });

    // Create Materials
    // Use hardcoded IDs for idempotency without referralLink
    const matId1 = "11111111-1111-1111-1111-111111111111";
    const matId2 = "22222222-2222-2222-2222-222222222222";
    const matId3 = "33333333-3333-3333-3333-333333333333";

    const material1 = await prisma.material.upsert({
        where: { id: matId1 },
        update: {},
        create: {
            id: matId1,
            name: "Introduction to Computer Science",
            course: "CSC101",
            courseCode: "CSC101",
            semester: "FIRST",
            price: 2500,
            pdfPath: "/uploads/sample-csc101.pdf",
            adminId: admin.id,
            isPublished: true,
        },
    });

    const material2 = await prisma.material.upsert({
        where: { id: matId2 },
        update: {},
        create: {
            id: matId2,
            name: "Financial Accounting Fundamentals",
            course: "ACC201",
            courseCode: "ACC201",
            semester: "SECOND",
            price: 3000,
            coAuthorId: coAuthor.id,
            equityPercentage: 30,
            coAuthorAccepted: true,
            pdfPath: "/uploads/sample-acc201.pdf",
            adminId: admin.id,
            isPublished: true,
        },
    });

    const material3 = await prisma.material.upsert({
        where: { id: matId3 },
        update: {},
        create: {
            id: matId3,
            name: "Structural Engineering Design",
            course: "CVE301",
            courseCode: "CVE301",
            semester: "FIRST",
            price: 4500,
            pdfPath: "/uploads/sample-cve301.pdf",
            adminId: admin.id,
            isPublished: true,
        },
    });
    console.log("✅ Created materials:", material1.name, material2.name, material3.name);

    // Create Orders
    const order1 = await prisma.order.upsert({
        where: { paymentRef: "PAY-KH-20001" },
        update: {},
        create: {
            amount: 2500,
            status: "COMPLETED",
            paymentRef: "PAY-KH-20001",
            userId: user1.id,
            adminId: admin.id,
            materialId: material1.id,
        },
    });

    const order2 = await prisma.order.upsert({
        where: { paymentRef: "PAY-KH-20002" },
        update: {},
        create: {
            amount: 3000,
            status: "COMPLETED",
            paymentRef: "PAY-KH-20002",
            userId: user1.id,
            adminId: admin.id,
            materialId: material2.id,
        },
    });

    const order3 = await prisma.order.upsert({
        where: { paymentRef: "PAY-KH-20003" },
        update: {},
        create: {
            amount: 4500,
            status: "COMPLETED",
            paymentRef: "PAY-KH-20003",
            userId: user2.id,
            adminId: admin.id,
            materialId: material3.id,
        },
    });
    console.log("✅ Created orders:", order1.paymentRef, order2.paymentRef, order3.paymentRef);

    // Link materials to users (downloads)
    await prisma.user.update({
        where: { id: user1.id },
        data: {
            materials: {
                connect: [{ id: material1.id }, { id: material2.id }],
            },
        },
    });

    await prisma.user.update({
        where: { id: user2.id },
        data: {
            materials: {
                connect: [{ id: material3.id }],
            },
        },
    });
    console.log("✅ Linked materials to users");

    // Create Withdrawal
    const withdrawal = await prisma.withdrawal.upsert({
        where: { reference: "WTH-KH-30001" },
        update: {},
        create: {
            amount: 5000,
            status: "PENDING",
            reference: "WTH-KH-30001",
            adminId: admin.id,
            bankName: "First Bank",
            accountName: "Admin User",
            accountNo: "1234567890",
        },
    });
    console.log("✅ Created withdrawal:", withdrawal.reference);

    console.log("🎉 Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
