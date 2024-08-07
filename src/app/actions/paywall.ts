import prisma from "../lib/prisma";
import { getServerSession } from "next-auth";
import { customAuthOptions } from "../lib/customAuthOptions";
import { error } from "console";

const FREE_USER_THRESHOLD_RESET_HOURS: number = Number(process.env.NEXT_PUBLIC_FREE_USER_THRESHOLD_RESET_HOURS) || 6;
const FREE_USER_QUOTA_THRESHOLD: number = Number(process.env.NEXT_PUBLIC_FREE_USER_QUOTA_THRESHOLD) || 30;

export async function countMessagesWithinQuotaPeriod() {
    const session = await getServerSession(customAuthOptions);
    const userId: number = Number(session?.user?.id);
    if (!userId) {
        return error("User not found");
    }
    if (session?.user?.subscriptionStatus) {
        return 0;
    }

    const messages: number = await prisma.message.count({
        where: {
            chat: {
                userId: userId
            },
            createdAt: {
                gte: new Date(new Date().getTime() - FREE_USER_THRESHOLD_RESET_HOURS * 60 * 60 * 1000)
            }
        }
    });

    return messages;
}

export async function isUserWithinQuota() {
    const count = Number(await countMessagesWithinQuotaPeriod());
    return count < FREE_USER_QUOTA_THRESHOLD;
}