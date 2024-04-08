import { CustomError } from "../../error/CustomError";
import { resend } from "./resend";

export const sendMail = async (to: string, subject: string, html: string) => {
  const { data, error } = await resend.emails.send({
    from: `noreply@${process.env.MAILGUN_DOMAIN}`,
    to,
    subject,
    html,
  });

  if (error) {
    throw new CustomError(500, error.message);
  }
  console.log(data);
};
