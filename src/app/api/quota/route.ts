import { countMessagesWithinQuotaPeriod } from "@/app/actions/paywall";

export async function GET (req: Request) {
    const count = await countMessagesWithinQuotaPeriod();
    return new Response(String(count));
}