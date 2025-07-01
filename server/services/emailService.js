export const sendEmail = async ({ to, subject, html }) => {
  // Integrate with nodemailer, sendgrid etc
  console.log(`[Stub Email] To: ${to} | Subject: ${subject}`);
  console.log(html);
};
