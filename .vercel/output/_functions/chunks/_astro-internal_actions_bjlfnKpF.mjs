import { g as getActionQueryString, a as astroCalledServerError, A as ActionError, d as deserializeActionResult, b as ACTION_QUERY_PARAMS, c as appendForwardSlash } from './astro-designed-error-pages_SVSLj7yN.mjs';
import 'es-module-lexer';
import 'kleur/colors';
import './astro/server_Du4t2wnU.mjs';
import 'clsx';
import 'cookie';
import { Resend } from 'resend';
import * as z from 'zod';
import { d as defineAction } from './server_DeE6m6FT.mjs';

const apiContextRoutesSymbol = Symbol.for("context.routes");
const ENCODED_DOT = "%2E";
function toActionProxy(actionCallback = {}, aggregatedPath = "") {
  return new Proxy(actionCallback, {
    get(target, objKey) {
      if (objKey in target || typeof objKey === "symbol") {
        return target[objKey];
      }
      const path = aggregatedPath + encodeURIComponent(objKey.toString()).replaceAll(".", ENCODED_DOT);
      function action(param) {
        return handleAction(param, path, this);
      }
      Object.assign(action, {
        queryString: getActionQueryString(path),
        toString: () => action.queryString,
        // Progressive enhancement info for React.
        $$FORM_ACTION: function() {
          const searchParams = new URLSearchParams(action.toString());
          return {
            method: "POST",
            // `name` creates a hidden input.
            // It's unused by Astro, but we can't turn this off.
            // At least use a name that won't conflict with a user's formData.
            name: "_astroAction",
            action: "?" + searchParams.toString()
          };
        },
        // Note: `orThrow` does not have progressive enhancement info.
        // If you want to throw exceptions,
        //  you must handle those exceptions with client JS.
        async orThrow(param) {
          const { data, error } = await handleAction(param, path, this);
          if (error) throw error;
          return data;
        }
      });
      return toActionProxy(action, path + ".");
    }
  });
}
function getActionPath(action) {
  let path = `${"/".replace(/\/$/, "")}/_actions/${new URLSearchParams(action.toString()).get(ACTION_QUERY_PARAMS.actionName)}`;
  {
    path = appendForwardSlash(path);
  }
  return path;
}
async function handleAction(param, path, context) {
  if (context) {
    const pipeline = Reflect.get(context, apiContextRoutesSymbol);
    if (!pipeline) {
      throw astroCalledServerError();
    }
    const action = await pipeline.getAction(path);
    if (!action) throw new Error(`Action not found: ${path}`);
    return action.bind(context)(param);
  }
  const headers = new Headers();
  headers.set("Accept", "application/json");
  let body = param;
  if (!(body instanceof FormData)) {
    try {
      body = JSON.stringify(param);
    } catch (e) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: `Failed to serialize request body to JSON. Full error: ${e.message}`
      });
    }
    if (body) {
      headers.set("Content-Type", "application/json");
    } else {
      headers.set("Content-Length", "0");
    }
  }
  const rawResult = await fetch(
    getActionPath({
      toString() {
        return getActionQueryString(path);
      }
    }),
    {
      method: "POST",
      body,
      headers
    }
  );
  if (rawResult.status === 204) {
    return deserializeActionResult({ type: "empty", status: 204 });
  }
  return deserializeActionResult({
    type: rawResult.ok ? "data" : "error",
    body: await rawResult.text()
  });
}
toActionProxy();

const generateContactEmailHTML = (name, message) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for Reaching Out</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    }
    .message-box {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      text-align: left;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Thanks for Reaching Out, ${name}!</h2>
    <p>I've received your message and will get back to you soon.</p>
    <div class="message-box">
      <p><strong>Your Message:</strong></p>
      <p>${message}</p>
    </div>
    <p class="footer">Best,<br>Kyle Kearney</p>
  </div>
</body>
</html>`;
const generateProjectEmailHTML = (formData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for the Inquiry</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    }
    .message-box {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      text-align: left;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Thanks for reaching out, ${formData.name}</h2>
    <p>I've received your project inquiry and will get back to you soon.</p>
    <p><strong>Your Project Details:</strong></p>
    <div class="message-box">
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Company:</strong> ${formData.company}</p>
      <p><strong>Budget:</strong> ${formData.budget}</p>
      <p><strong>Timeline:</strong> ${formData.timeline}</p>
      <p><strong>Type:</strong> ${formData.type}</p>
      <p><strong>Description:</strong> ${formData.description}</p>
    </div>
    <p class="footer">Best,<br>Kyle Kearney</p>
  </div>
</body>
</html>`;

const resend = new Resend("re_ZMiDpWLG_PZWgbTTuVtBV35mwGKjE2337");
const handleContactForm = async (formData) => {
  try {
    const { name, email, message } = formData;
    await resend.emails.send({
      from: "no-reply@kylekrny.com",
      replyTo: email,
      to: "kyle@kylekrny.com",
      subject: "New Contact Form Submission",
      html: `<h3>New Message from ${name}</h3><p>${message}</p><p>Email: ${email}</p>`
    });
    const emailHtml = generateContactEmailHTML(name, message);
    await resend.emails.send({
      from: "kylekrny.com <no-reply@kylekrny.com>",
      to: email,
      subject: "Thanks for Reaching out!",
      html: emailHtml
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: "Internal server error." }), {
      status: 500
    });
  }
};
const handleProjectForm = async (formData) => {
  try {
    const { name, email, company, budget, timeline, type, description } = formData;
    await resend.emails.send({
      from: "kylekrny.com <no-reply@kylekrny.com>",
      replyTo: email,
      to: "kyle@kylekrny.com",
      subject: "New Contact Form Submission",
      text: `
                New Project Inquiry from ${name} 

                Email: ${email} 

                Company: ${company} 

                Budget: ${budget} 

                Timeline: ${timeline} 

                Type: ${type} 

                Description: ${description}
            `
    });
    const emailHtml = generateProjectEmailHTML(formData);
    await resend.emails.send({
      from: "kylekrny.com <no-reply@kylekrny.com>",
      to: email,
      subject: "Thank you for your Project Inquiry!",
      html: emailHtml,
      text: "Thanks for reaching out! I will be in touch soon."
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return { error, status: 500 };
  }
};
const server = {
  contact: defineAction({
    input: z.object({
      email: z.string().email({ message: "Invalid email address" }),
      name: z.string(),
      message: z.string()
    }),
    handler: async (input) => {
      return await handleContactForm(input);
    }
  }),
  project: defineAction({
    input: z.object({
      name: z.string(),
      email: z.string().email({ message: "Invalid email address" }),
      company: z.string(),
      budget: z.string(),
      timeline: z.string(),
      type: z.string(),
      description: z.string()
    }),
    handler: async (input) => {
      return await handleProjectForm(input);
    }
  })
};

const actions = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	server
}, Symbol.toStringTag, { value: 'Module' }));

export { actions as a, server as s };
