import ThanksTemp from "emails/thanks";
import VerificationTemp from "emails/verification";
import { nanoid } from "nanoid";
import { resend } from "~/lib/resend";
import {
  type SendWelcomeEmailProps,
  type sendVerificationEmailProps,
} from "~/types";

export const sendWelcomeEmail = async ({
  toMail,
  userName,
}: SendWelcomeEmailProps) => {
  const subject = "Thanks for using Otask!";
  const temp = ThanksTemp({ userName });

  //@ts-expect-error text field is required
  await resend.emails.send({
    from: `Otask App <Otask@ariful.com>`,
    to: toMail,
    subject: subject,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    react: temp,
  });
};

export const sendVerificationEmail = async ({
  toMail,
  verificationUrl,
  userName,
}: sendVerificationEmailProps) => {
  const subject = "Email Verification for Otask";
  const temp = VerificationTemp({ userName, verificationUrl });

  //@ts-expect-error text field is required
  await resend.emails.send({
    from: `Otask App <Otask@ariful.com>`,
    to: toMail,
    subject: subject,
    headers: {
      "X-Entity-Ref-ID": nanoid(),
    },
    react: temp,
  });
};
