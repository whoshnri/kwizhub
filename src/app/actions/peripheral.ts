"use server"
import prisma from "@/lib/db"
import { getUserSession } from "./auth"



export async function getTutors() {
    const activeUser = await getUserSession()
    if (!activeUser) {
        return { status: false, data: null }
    }
    try {
        const tutors = await prisma.admin.findMany({
            select: {
                id: true,
                name: true,
                username: true,
            }
        })

        const data = tutors.map((tutor) => {
            if (activeUser.username !== tutor.username) {
                return {
                    value: tutor.id, // Changed to ID
                    label: tutor.name,
                }
            }
        }).filter(Boolean) // Filter out undefined entries

        return { status: true, data }
    } catch (error) {
        return { status: false, data: null }
    }
}