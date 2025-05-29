// this is a file for the upcycle order that will be emailed from a form

import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_ENV_VARIABLE);

export async function POST(req: Request) {}
