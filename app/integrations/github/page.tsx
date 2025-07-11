import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitHub Webhooks | Monitor Repos and PR Events with Alerts - Hookflo',
  description:
    'Track GitHub webhooks like push, pull_request, and issue events with Hookflo. Get real-time alerts in Slack or Email and log every event effortlessly.',
  keywords: [
    'GitHub webhooks',
    'push event',
    'pull_request',
    'GitHub integration',
    'repository monitoring',
    'webhook logs',
    'real-time alerts',
    'Slack notifications',
    'email alerts',
  ],
  openGraph: {
    title: 'Monitor GitHub Webhooks | Alerts for Push & PRs - Hookflo',
    description:
      'Receive Slack or Email notifications for GitHub repo events using Hookflo.',
    url: 'https://www.hookflo.com/integrations/github',
    siteName: 'Hookflo',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Webhooks Monitoring with Hookflo',
    description:
      'Alert your team when code is pushed or PRs are opened using Hookflo webhook monitoring.',
  },
};

export default function GitHubWebhooksPage() {
  return (
    <article className='max-w-3xl px-6 py-20 mx-auto prose prose-zinc dark:prose-invert'>
      <header className='mb-10'>
        <h1 className='text-4xl font-semibold'>
          Track GitHub Webhooks with Hookflo
        </h1>
        <p className='text-lg text-zinc-500 dark:text-zinc-400 mt-2'>
          Monitor repository events like push, pull request, or issue updates
          with Slack or Email alerts.
        </p>
      </header>

      <section>
        <h2>What are GitHub Webhooks?</h2>
        <p>
          GitHub webhooks notify you when certain actions happen in your
          repositories — like code pushes, PRs, or issue comments. Hookflo lets
          you track and alert your team in real-time.
        </p>
      </section>
      <br />
      <section>
        <h2>Popular Events Hookflo Supports</h2>
        <ul>
          <li>
            <code>push</code> — code pushed to a branch
          </li>
          <li>
            <code>pull_request</code> — PR opened, merged or closed
          </li>
          <li>
            <code>issues</code> — issue opened, labeled, or closed
          </li>
          <li>
            <code>issue_comment</code> — comment added to issue or PR
          </li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Why Use Hookflo with GitHub?</h2>
        <ul>
          <li>Notify dev teams instantly via Slack or Email</li>
          <li>Track who pushed what and when</li>
          <li>Centralized webhook logs and retries</li>
          <li>Combine with other tools like Supabase, Stripe, Clerk</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>How to Set Up GitHub Webhooks in Hookflo</h2>
        <ol>
          <li>Log in to your Hookflo dashboard</li>
          <li>Create a new webhook and choose "GitHub" as the platform</li>
          <li>Copy the Hookflo webhook URL</li>
          <li>Go to GitHub repo → Settings → Webhooks</li>
          <li>Paste the URL, select JSON format, and choose event types</li>
          <li>Save and test webhook</li>
        </ol>
      </section>
      <br />
      <section>
        <h2>
          Sample Webhook Payload: <code>push</code>
        </h2>
        <pre>
          <code className='language-json'>{`{
  "ref": "refs/heads/main",
  "pusher": {
    "name": "octocat"
  },
  "repository": {
    "name": "hookflo-repo"
  },
  "commits": [
    {
      "message": "Fix critical bug"
    }
  ]
}`}</code>
        </pre>
      </section>
      <br />
      <section>
        <h2>Common Use Cases</h2>
        <ul>
          <li>Alert on push to main branches</li>
          <li>Notify team on PR merges</li>
          <li>Track activity across multiple GitHub repos</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Resources</h2>
        <p>
          <Link
            href='https://docs.hookflo.com/webhook-platforms/github'
            target='_blank'
            rel='noopener noreferrer'
          >
            → View full GitHub integration guide
          </Link>
        </p>
      </section>
    </article>
  );
}
