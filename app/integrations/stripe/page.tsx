import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stripe Webhooks | Monitor Payments and Subscriptions - Hookflo',
  description:
    'Track Stripe events like invoice paid, subscription updates, and payment failures. Hookflo delivers instant webhook alerts to Slack or Email with full logging.',
  keywords: [
    'Stripe webhooks',
    'Stripe alerts',
    'invoice.paid',
    'subscription.created',
    'webhook delivery',
    'payment failed alert',
    'Slack email webhook',
    'Hookflo Stripe integration',
  ],
  openGraph: {
    title: 'Stripe Webhooks Monitoring | Alerts for Billing Events - Hookflo',
    description:
      'Track and alert on Stripe billing and subscription events in real-time with Hookflo.',
    url: 'https://www.hookflo.com/integrations/stripe',
    siteName: 'Hookflo',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stripe Webhooks Monitoring with Hookflo',
    description:
      'Get notified of Stripe subscription or payment events via Slack/Email instantly.',
  },
};

export default function StripeWebhooksPage() {
  return (
    <article className='max-w-3xl px-6 py-20 mx-auto prose prose-zinc dark:prose-invert'>
      <header className='mb-10'>
        <h1 className='text-4xl font-semibold'>
          Track Stripe Webhooks with Hookflo
        </h1>
        <p className='text-lg text-zinc-500 dark:text-zinc-400 mt-2'>
          Monitor subscription updates, invoice status, and payment failures
          from Stripe with real-time alerts.
        </p>
      </header>

      <section>
        <h2>What are Stripe Webhooks?</h2>
        <p>
          Stripe sends webhook events when changes happen in your billing system
          — like payments, renewals, or failed charges. With Hookflo, you can
          monitor and alert on these events easily.
        </p>
      </section>
      <br />
      <section>
        <h2>Popular Events Hookflo Supports</h2>
        <ul>
          <li>
            <code>invoice.paid</code> — payment successful
          </li>
          <li>
            <code>invoice.payment_failed</code> — payment failed
          </li>
          <li>
            <code>customer.subscription.created</code> — new subscription
          </li>
          <li>
            <code>customer.subscription.updated</code> — plan changes or trial
            end
          </li>
          <li>
            <code>customer.subscription.deleted</code> — subscription cancelled
          </li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Why Use Hookflo with Stripe?</h2>
        <ul>
          <li>Get real-time billing alerts in Slack/Email</li>
          <li>Monitor customer lifecycle events (trials, upgrades, churn)</li>
          <li>Retry failed notifications from dashboard</li>
          <li>Pair with GitHub, Supabase, and Clerk integrations</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>How to Set Up Stripe Webhooks in Hookflo</h2>
        <ol>
          <li>Create a webhook in Hookflo and choose "Stripe"</li>
          <li>Copy the generated webhook URL</li>
          <li>Go to your Stripe Dashboard → Developers → Webhooks</li>
          <li>Add endpoint and paste the URL</li>
          <li>
            Select events you want to listen to (e.g. <code>invoice.paid</code>)
          </li>
        </ol>
      </section>
      <br />
      <section>
        <h2>
          Sample Webhook Payload: <code>invoice.paid</code>
        </h2>
        <pre>
          <code className='language-json'>{`{
  "type": "invoice.paid",
  "data": {
    "object": {
      "customer_email": "stripeuser@hookflo.io",
      "amount_paid": 2999,
      "status": "paid"
    }
  }
}`}</code>
        </pre>
      </section>
      <br />
      <section>
        <h2>Common Use Cases</h2>
        <ul>
          <li>Alert when a customer fails to pay</li>
          <li>Notify teams when subscription is cancelled</li>
          <li>Track MRR-impacting events in real time</li>
        </ul>
      </section>
      <br />
      <section>
        <h2>Resources</h2>
        <p>
          <Link
            href='https://docs.hookflo.com/webhook-platforms/stripe'
            target='_blank'
            rel='noopener noreferrer'
          >
            → View full Stripe integration guide
          </Link>
        </p>
      </section>
    </article>
  );
}
