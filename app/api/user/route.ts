export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-server-utils";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user } = await verifyAuth(req);
    const body = await req.json();
    const { name, company, preferences } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        company: company !== undefined ? company : user.company,
        preferences: preferences !== undefined ? preferences : user.preferences,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
