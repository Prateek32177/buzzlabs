import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Supabase Webhooks | Monitor Realtime DB Events with Alerts - Hookflo',
  description:
    'Track Supabase auth and database insert/update/delete events via webhooks. Hookflo lets you send alerts to Slack or Email in real-time with full logging and retries.',
  keywords: [
    'Supabase webhooks',
    'Supabase alerts',
    'auth.insert',
    'auth.update',
    'webhook monitoring',
    'Supabase triggers',
    'Slack webhook alerts',
    'hookflo',
    'email webhook alerts',
  ],
  openGraph: {
    title: 'Monitor Supabase Webhooks | Alerting for DB Events - Hookflo',
    description:
      'Capture real-time Supabase auth and DB changes using Hookflo and get notified instantly.',
    url: 'https://www.hookflo.com/integrations/supabase',
    siteName: 'Hookflo',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supabase Webhooks Monitoring with Hookflo',
    description:
      'Easily track Supabase database or auth changes and get alerts with Hookflo.',
  },
};

export default function SupabaseWebhooksPage() {
  return (
    <article className='max-w-3xl px-6 py-20 mx-auto prose prose-zinc dark:prose-invert'>
      <header className='mb-10'>
        <h1 className='text-4xl font-semibold'>
          Track Supabase Webhooks with Hookflo
        </h1>
        <p className='text-lg text-zinc-500 dark:text-zinc-400 mt-2'>
          Monitor authentication or table changes in Supabase and send instant
          alerts to Slack or Email using Hookflo.
        </p>
      </header>

      <section>
        <h2>What are Supabase Webhooks?</h2>
        <p>
          Supabase emits webhook events when specific database or auth events
          occur — like a new user signup or a row insert. You can use these
          webhooks to stay informed or trigger workflows.
        </p>
      </section>
      <br />
      <section>
        <h2>Popular Events Hookflo Supports</h2>
        <ul>
          <li>
            <code>auth.insert</code> — new user registration
          </li>
          <li>
            <code>auth.update</code> — metadata change
          </li>
          <li>
            <code>table.insert</code> — new data added
          </li>
          <li>
            <code>table.delete</code> — data removed
          </li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Why Use Hookflo with Supabase?</h2>
        <ul>
          <li>Alert teams about signups, record changes, or deletions</li>
          <li>
            Instant Slack or Email notifications for production DB changes
          </li>
          <li>Track webhook logs and retry failures in Hookflo dashboard</li>
          <li>Combine with other platforms like GitHub, Stripe, Clerk</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>How to Set Up Supabase Webhooks in Hookflo</h2>
        <ol>
          <li>Log in to Hookflo and create a new webhook</li>
          <li>Choose "Supabase" as the platform</li>
          <li>Copy the Hookflo webhook URL</li>
          <li>In Supabase → Project Settings → Webhooks → Add URL</li>
          <li>Specify event type and the target table</li>
          <li>Paste the URL and save</li>
        </ol>
      </section>
      <br />
      <section>
        <h2>
          Sample Webhook Payload: <code>auth.insert</code>
        </h2>
        <pre>
          <code className='language-json'>
            {`{
  "type": "INSERT",
  "table": "auth.users",
  "record": {
    "id": "user_789xyz",
    "email": "newuser@supabase.io",
    "created_at": "2023-01-01T00:00:00Z"
  }
}`}
          </code>
        </pre>
      </section>
      <br />
      <section>
        <h2>Common Use Cases</h2>
        <ul>
          <li>Notify product or sales team when users sign up</li>
          <li>Alert engineers on critical table changes</li>
          <li>Log inserts or deletes for audit trails</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Resources</h2>
        <p>
          <Link
            href='https://docs.hookflo.com/webhook-platforms/supabase'
            target='_blank'
            rel='noopener noreferrer'
          >
            → View full Supabase integration guide
          </Link>
        </p>
      </section>
    </article>
  );
}
