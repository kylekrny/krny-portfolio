import { ActionError, defineAction } from 'astro:actions';
import { Resend } from 'resend';
import { z } from 'astro:schema';
import { generateContactEmailHTML, generateProjectEmailHTML } from './utils';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

type FormData = {
  name: string;
  email: string;
  message: string;
};

type EmailObject = {
  from?: string;
  to?: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
};

const handleEmail = async ({
  from = 'kylekrny.com <no-reply@kylekrny.com>',
  to = 'kyle@kylekrny.com',
  subject,
  html,
  text = 'This email is best viewed in a modern email client.',
  replyTo = 'kyle@kylekrny.com',
}: EmailObject) => {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
      to: to,
      replyTo: replyTo,
      subject: subject,
      ...(html && { html: html }),
      text: text,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error('handleEmail Failed:', error);
    throw error;
  }
};

const handleContactForm = async (formData: FormData) => {
  try {
    const { name, email, message } = formData;

    const submission = {
      replyTo: email,
      subject: 'New Contact Form Submission',
      text: `New Message from ${name} \n\n${message}`,
    };

    const confirmation = {
      to: email,
      subject: 'Thanks for Reaching Out!',
      html: generateContactEmailHTML(name, message),
    };

    const emails = [submission, confirmation];

    const results = await Promise.allSettled(emails.map(handleEmail));

    results.forEach((result) => {
      if (result.status === 'rejected') {
        throw new ActionError({
          message: result.reason.message,
          code: 'BAD_REQUEST',
        });
      }
    });
    return results;
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
    });
  }
};

export type ProjectFormData = {
  customerName: string;
  customerEmail: string;
  company: string;
  budget: string;
  timeline: string;
  type: string;
  description: string;
};

const handleProjectForm = async (formData: Partial<ProjectFormData>) => {
  try {
    const {
      customerName,
      customerEmail,
      company,
      budget,
      timeline,
      type,
      description,
    } = formData;

    const email = customerEmail;
    const name = customerName;

    const submission = {
      replyTo: email,
      subject: 'New Project Inquiry',
      text: `
                New Project Inquiry from ${name} \n
                Email: ${email} \n
                Company: ${company || 'n/a'} \n
                Budget: ${budget} \n
                Timeline: ${timeline} \n
                Type: ${type} \n
                Description: ${description}
            `,
    };

    const confirmation = {
      to: email,
      subject: 'Thank you for your Project Inquiry!',
      html: generateProjectEmailHTML(formData),
      text: 'Thanks for reaching out! I will be in touch soon.',
    };

    const emails = [submission, confirmation];

    const results = await Promise.allSettled(emails.map(handleEmail));

    results.forEach((result) => {
      if (result.status === 'rejected') {
        throw new ActionError({
          message: result.reason.message,
          code: 'BAD_REQUEST',
        });
      }
    });
    return results;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ActionError({
      message: 'Internal server error.',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
};

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
  project: defineAction({
    input: z.object({
      customerName: z.string(),
      customerEmail: z.string().email({ message: 'Invalid email address' }),
      company: z.string().optional(),
      budget: z.string(),
      timeline: z.string(),
      type: z.string(),
      description: z.string(),
    }),
    handler: async (input) => {
      return await handleProjectForm(input);
    },
  }),
};
