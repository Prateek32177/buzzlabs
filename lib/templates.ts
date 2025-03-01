type Template = {
  id: string;
  name: string;
  type: 'email' | 'slack';
  render: (data: any) => any;
};

export const emailTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Basic Notification',
    type: 'email',
    render: data => ({
      subject: 'New Notification',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Event</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Event Type: <strong>${data.type}</strong></p>
            <pre style="background: #f3f4f6; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template2',
    name: 'Welcome Email',
    type: 'email',
    render: data => ({
      subject: 'Welcome to Our Service',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome, ${data.name}! 👋</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">We're excited to have you on board.</p>
            <p style="font-size: 16px; line-height: 1.5;">Feel free to explore our services!</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template3',
    name: 'Weekly Summary',
    type: 'email',
    render: data => ({
      subject: 'Your Weekly Summary',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Weekly Summary 📊</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Here's what happened this week:</p>
            <ul style="padding-left: 20px;">
             ${JSON.stringify(data, null, 2)}
            </ul>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template4',
    name: 'Payment Confirmation',
    type: 'email',
    render: data => ({
      subject: 'Payment Confirmation',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Payment Received ✅</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Thank you for your payment of <strong>${data.amount}</strong></p>
            <p style="font-size: 14px; color: #6B7280;">Transaction ID: ${data.transactionId}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template5',
    name: 'Subscription Renewal',
    type: 'email',
    render: data => ({
      subject: 'Subscription Renewal',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; color: #333;">
          <div style="background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Subscription Renewed 🎉</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; line-height: 1.5;">Your subscription has been successfully renewed.</p>
            <p style="font-size: 14px; color: #6B7280;">Next billing date: ${data.nextBillingDate}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://superhook.com" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
          </div>
        </div>
      `,
    }),
  },
  {
    id: 'template6',
    name: 'Custom Template',
    type: 'email',
    render: data => ({
      subject: 'Custom build',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
        <head>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="x-apple-disable-message-reformatting" />
          <!--$-->
        </head>
        <div
          style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
          See your stats from 2024
        </div>
        <body
          style='background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'>
          <table
            align="center"
            width="100%"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="margin-left:auto;margin-right:auto;width:100%;max-width:600px;padding:0px">
            <tbody>
              <tr style="width:100%">
                <td>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="padding:2rem;text-align:center">
                    <tbody>
                      <tr>
                        <td>
                          <p
                            style="margin-left:0px;margin-right:0px;margin-bottom:2rem;margin-top:1rem;padding:0px;text-align:center;font-size:1.5rem;line-height:2rem;font-weight:400;margin:16px 0">
                            <span style="font-weight:700;letter-spacing:-0.05em"
                              >Superhook</span
                            >
                          </p>
                          <p
                            style="font-size:0.875rem;line-height:1.25rem;font-weight:400;text-transform:uppercase;letter-spacing:0.05em;margin:16px 0">
                            2024<!-- -->
                            in review
                          </p>
                          <h1
                            style="margin-top:1rem;margin-bottom:1rem;font-size:2.25rem;line-height:1.25;font-weight:500">
                            Your Year with Superhook
                          </h1>
                          <p
                            style="margin-bottom:2rem;font-size:1.125rem;line-height:2rem;margin:16px 0">
                            What a year it&#x27;s been! Let&#x27;s take a look at how
                            you&#x27;ve used Papermark to share your important
                            documents.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    align="center"
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="padding-bottom:1.5rem;text-align:center">
                    <tbody>
                      <tr>
                        <td>
                          <p
                            style="font-size:1.25rem;line-height:2rem;color:rgb(17,24,39);margin:16px 0">
                            We&#x27;re excited to support you next year! <br />Happy
                            Holidays from the Papermark team :)
                          </p>
                          <a
                            href="https://buzzlabs.vercel.app"
                            style="margin-top:1rem;display:inline-flex;align-items:center;border-radius:9999px;background-color:rgb(17,24,39);padding-left:3rem;padding-right:3rem;padding-top:1rem;padding-bottom:1rem;text-align:center;font-size:0.875rem;line-height:1.25rem;font-weight:700;color:rgb(255,255,255);text-decoration-line:none"
                            target="_blank"
                            >Share your stats</a
                          ><a
                            href="https://buzzlabs.vercel.app"
                            style="margin-top:1rem;display:block;align-items:center;text-align:center;font-size:0.875rem;line-height:1.25rem;font-weight:700;color:rgb(17,24,39);text-decoration-line:none"
                            target="_blank"
                            >Go to your dashboard</a
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <!--/$-->
        </body>
        <footer>
         <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 12px; text-align: center;">Delivered by <a href="https://buzzlabs.vercel.app" style="color: #4F46E5; text-decoration: none;">Superhook</a></p>
        </footer>
      </html>`,
    }),
  },
];

export const slackTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Basic Slack Message',
    type: 'slack',
    render: data => ({
      text: 'New Notification',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New Event*\nType: ${data.type}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(data, null, 2) + '```',
          },
        },
      ],
    }),
  },
  {
    id: 'template2',
    name: 'Alert Notification',
    type: 'slack',
    render: data => ({
      text: 'Alert Notification',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Alert!*\nSeverity: ${data.severity}\nMessage: ${data.message}`,
          },
        },
      ],
    }),
  },
  {
    id: 'template3',
    name: 'Daily Report',
    type: 'slack',
    render: data => ({
      text: 'Daily Report',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Daily Report*\nDate: ${data.date}\nSummary: ${data.summary}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(data.details, null, 2) + '```',
          },
        },
      ],
    }),
  },
  {
    id: 'template4',
    name: 'Incident Report',
    type: 'slack',
    render: data => ({
      text: 'Incident Report',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Incident Report*\nIncident ID: ${data.incidentId}\nStatus: ${data.status}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '```' + JSON.stringify(data.details, null, 2) + '```',
          },
        },
      ],
    }),
  },
  {
    id: 'template5',
    name: 'System Update',
    type: 'slack',
    render: data => ({
      text: 'System Update',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*System Update*\nVersion: ${data.version}\nDetails: ${data.details}`,
          },
        },
      ],
    }),
  },
];

export function getTemplate(id: string, type: 'email' | 'slack'): Template {
  const templates = type === 'email' ? emailTemplates : slackTemplates;
  const template = templates.find(t => t.id === id);
  if (!template) throw new Error(`Template ${id} not found`);
  return template;
}
