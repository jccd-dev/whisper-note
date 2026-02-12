import { NextResponse } from 'next/server';
import { and, isNotNull, lt } from 'drizzle-orm';
import { db } from '@/db';
import { temporaryMessages } from '@/db/schema';

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        return NextResponse.json(
            { ok: false, error: 'CRON_SECRET is not set' },
            { status: 500 }
        );
    }

    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : '';

    if (token !== secret) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }

    const deleted = await db
        .delete(temporaryMessages)
        .where(
            and(
                isNotNull(temporaryMessages.expiresAt),
                lt(temporaryMessages.expiresAt, new Date())
            )
        )
        .returning({ id: temporaryMessages.id });

    return NextResponse.json({ ok: true, deleted: deleted.length });
}
