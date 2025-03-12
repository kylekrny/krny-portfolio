import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';
import { z } from 'astro:schema';
import { generateContactEmailHTML } from './utils';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

type FormData = {
  name: string;
  email: string;
  message: string;
};

const handleContactForm = async (formData: FormData) => {
  try {
    const { name, email, message } = formData;

    await resend.emails.send({
      from: 'no-reply@kylekrny.com',
      replyTo: email,
      to: 'kyle@kylekrny.com',
      subject: 'New Contact Form Submission',
      html: `<h3>New Message from ${name}</h3><p>${message}</p><p>Email: ${email}</p>`,
    });

    const emailHtml = generateContactEmailHTML(name, message);

    await resend.emails.send({
      from: 'kylekrny.com <no-reply@kylekrny.com>',
      to: email as string,
      subject: 'Thanks for Reaching out!',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
    });
  }
};

type ProjectFormData = {
  name: string;
  email: string;
  company: string;
  budget: string;
  timeline: string;
  type: string;
  description: string;
};

// const handleProjectForm = async (formData: ProjectFormData) => {
//   try {
//     const { name, email, company, budget, timeline, type, description } =
//       formData;

//     await resend.emails.send({
//       from: 'kylekrny.com <no-reply@kylekrny.com>',
//       replyTo: email,
//       to: 'kyle@kylekrny.com',
//       subject: 'New Contact Form Submission',
//       html: `<h3>New Message from ${name}</h3><p>${message}</p><p>Email: ${email}</p>`,
//     });

//     await resend.emails.send({
//       from: 'kylekrny.com <no-reply@kylekrny.com>',
//       to: email as string,
//       subject: 'Thanks for Contacting Us!',
//       html: `
//                 <h2>Hi ${name},</h2>
//                 <p>Thanks for reaching out! I'll get back to you soon.</p>
//                 <p><strong>Your Message:</strong></p>
//                 <blockquote>${message}</blockquote>
//                 <p>Best, <br/>Kyle Kearney</p>
//             `,
//     });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return { error: 'Internal server error.', status: 500 };
//   }
// };

export const server = {
  contact: defineAction({
    input: z.object({
      email: z.string().email({ message: 'Invalid email address' }),
      name: z.string(),
      message: z.string(),
    }),
    handler: async (input) => {
      return await handleContactForm(input);
    },
  }),
};
