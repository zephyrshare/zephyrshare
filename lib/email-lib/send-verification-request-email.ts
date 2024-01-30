import { sendEmail } from './email-utils';
import LoginLink from './email-verification-link';

export const sendVerificationRequestEmail = async (params: {
  email: string;
  url: string;
}) => {
  const { url, email } = params;
  const emailTemplate = LoginLink({ url });
  await sendEmail({
    to: email as string,
    subject: "Welcome to ZephyrShare!",
    react: emailTemplate,
    test: process.env.NODE_ENV === "development",
  });
};
