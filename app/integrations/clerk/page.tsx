import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Clerk Webhooks | Monitor Clerk Auth Events with Real-Time Alerts - Hookflo',
  description:
    'Track Clerk webhooks like user.created and user.verification.updated using Hookflo. Get instant alerts in Slack or Email, view webhook logs, and debug in real-time.',
  keywords: [
    'Clerk webhooks',
    'user.created',
    'webhook monitoring',
    'Clerk integration',
    'Clerk user events',
    'webhook alerts',
    'hookflo',
    'real-time notifications',
    'Slack webhook alerts',
    'email webhook alerts',
  ],
};

export default function ClerkWebhooksPage() {
  return (
    <article className='max-w-3xl px-6 py-20 mx-auto prose prose-zinc dark:prose-invert'>
      <header className='mb-10'>
        <h1 className='text-4xl font-semibold'>
          Track Clerk Webhooks with Hookflo
        </h1>
        <p className='text-lg text-zinc-500 dark:text-zinc-400 mt-2'>
          Monitor and route Clerk authentication events like user signups,
          deletions, or verification updates to Slack or Email instantly.
        </p>
      </header>

      <section>
        <h2>What are Clerk Webhooks?</h2>
        <p>
          Clerk emits webhooks when user events occur in your authentication
          flow — like new user signups, profile updates, or deletions. These
          events are essential for audit trails, analytics, and internal alerts.
        </p>
      </section>
      <br />

      <section>
        <h2>Popular Events Hookflo Supports</h2>
        <ul>
          <li>
            <code>user.created</code> — new signup
          </li>
          <li>
            <code>user.deleted</code> — user deletion
          </li>
          <li>
            <code>user.updated</code> — profile or metadata change
          </li>
          <li>
            <code>user.verification.updated</code> — email/phone verification
            event
          </li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Why Use Hookflo with Clerk?</h2>
        <ul>
          <li>
            Instant alerting in Slack or Email when users sign up or are deleted
          </li>
          <li>
            No-code setup — just copy the webhook URL from Hookflo dashboard
          </li>
          <li>
            View webhook logs, inspect payloads, and retry failures easily
          </li>
          <li>
            Supports Clerk alongside platforms like Supabase, GitHub, and Stripe
          </li>
        </ul>
      </section>
      <br />
      <section>
        <h2>How to Set Up Clerk Webhooks in Hookflo</h2>
        <ol>
          <li>Log in to your Hookflo dashboard</li>
          <li>Create a new webhook and choose "Clerk" as the platform</li>
          <li>Copy the webhook URL Hookflo provides</li>
          <li>Go to your Clerk dashboard → Webhooks → Add Endpoint</li>
          <li>
            Paste the URL, select the desired events (like{' '}
            <code>user.created</code>)
          </li>
          <li>Save the webhook</li>
        </ol>
      </section>
      <br />
      <section>
        <h2>
          Sample Webhook Payload: <code>user.created</code>
        </h2>
        <pre>
          <code className='language-json'>
            {`{
  "type": "user.created",
  "data": {
    "id": "user_abc123",
    "email_addresses": [
      {
        "email_address": "clerkuser@example.com"
      }
    ],
    "created_at": 1687219200
  }
}`}
          </code>
        </pre>
      </section>
      <br />
      <section>
        <h2>Common Use Cases</h2>
        <ul>
          <li>Notify sales or support when a new user signs up</li>
          <li>Alert developers when a user email or phone is verified</li>
          <li>Clean up internal data when a user is deleted</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Resources</h2>
        <p>
          <Link
            href='https://docs.hookflo.com/webhook-platforms/clerk'
            target='_blank'
            rel='noopener noreferrer'
          >
            → View full Clerk integration guide
          </Link>
        </p>
      </section>
    </article>
  );
}
