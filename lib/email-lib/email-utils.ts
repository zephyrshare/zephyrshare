import { ReactElement, JSXElementConstructor } from 'react';
import { Resend } from 'resend';
import { v4 as uuid } from 'uuid';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendEmail = async ({
  to,
  subject,
  react,
  marketing,
  system,
  test,
}: {
  to: string;
  subject: string;
  react: ReactElement<any, string | JSXElementConstructor<any>>;
  marketing?: boolean;
  system?: boolean;
  test?: boolean;
}) => {
  if (!resend) {
    console.log('Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work.');
    return Promise.resolve();
  }
  // https://github.com/resend/resend-examples/blob/main/with-prevent-thread-on-gmail/src/pages/api/send.ts
  return resend.emails.send({
    from: marketing
      ? 'ZephyrShare <no-reply@zephyrshare.com>'
      : system
      ? 'ZephyrShare <no-reply@zephyrshare.com>'
      : 'ZephyrShare <no-reply@zephyrshare.com>',
    to: test ? 'delivered@resend.dev' : to,
    reply_to: marketing ? 'no-reply@zephyrshare.com' : undefined,
    subject,
    react,
    headers: {
      'X-Entity-Ref-ID': uuid(),
    },
  });
};
