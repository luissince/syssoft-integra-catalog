// app/api/get-token/route.ts

import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const token = await getToken({
        req,
    });

    if (!token) {
        return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json({
        accessToken: token.accessToken,
    });
}