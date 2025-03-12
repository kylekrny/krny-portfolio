import type { ProjectFormData } from '.';

export const generateContactEmailHTML = (name: string, message: string) => `
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

export const generateProjectEmailHTML = (formData: ProjectFormData) => `
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
