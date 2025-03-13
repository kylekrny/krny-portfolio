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
    const { customerName, customerEmail, company, budget, timeline, type, description } =
      formData;

    const email = customerEmail;
    const name = customerName;

    await resend.emails.send({
      from: 'kylekrny.com <no-reply@kylekrny.com>',
      replyTo: email,
      to: 'kyle@kylekrny.com',
      subject: 'New Contact Form Submission',
      text: `
                New Project Inquiry from ${name} \n
                Email: ${email} \n
                Company: ${company || 'n/a'} \n
                Budget: ${budget} \n
                Timeline: ${timeline} \n
                Type: ${type} \n
                Description: ${description}
            `,
    });

    const emailHtml = generateProjectEmailHTML(formData);

    await resend.emails.send({
      from: 'kylekrny.com <no-reply@kylekrny.com>',
      to: email as string,
      subject: 'Thank you for your Project Inquiry!',
      html: emailHtml,
      text: 'Thanks for reaching out! I will be in touch soon.',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: error, status: 500 };
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
