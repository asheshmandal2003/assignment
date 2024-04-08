import { Resend } from "resend";

export const resend = new Resend(String(process.env.EMAIL_API_KEY));
