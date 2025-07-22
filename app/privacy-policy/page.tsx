'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className='min-h-screen text-zinc-300'>
      {/* Navbar */}
      <div className='flex items-center justify-between px-6 py-4 border-b border-zinc-800  text-white'>
        <div className='text-lg font-semibold'>Hookflo</div>
        <Link
          href='/'
          className='text-sm text-zinc-300 hover:text-white transition-colors'
        >
          ← Back to Home
        </Link>
      </div>

      {/* Content */}
      <div className='max-w-3xl mx-auto px-6 py-10 text-sm leading-6'>
        <h1 className='text-2xl font-bold text-white mb-4'>
          Privacy Policy for Hookflo
        </h1>
        <p className='mb-6 text-zinc-400'>Last updated: July 22, 2025</p>

        <p className='mb-4'>
          At <strong>Hookflo.com</strong> ("we", "our", "us"), we respect your
          privacy and are committed to protecting your personal data. This
          Privacy Policy explains what information we collect, how we use it,
          and your rights regarding your data.
        </p>

        <h2 className='text-lg font-semibold text-white mt-8 mb-2'>
          1. Information We Collect and Why
        </h2>

        <p className='mb-4'>
          <strong>Account Information:</strong> When you create an account:
        </p>
        <ul className='mb-4 list-disc list-inside space-y-1'>
          <li>
            Your email address (used for authentication, notifications, and
            account management)
          </li>
          <li>
            Your OAuth profile data (e.g., name, profile image – depending on
            provider)
          </li>
          <li>OAuth providers (Google, GitHub)</li>
          <li>Optional account details (username)</li>
        </ul>
        <p className='mb-4'>
          We need this information to manage your account and provide access to
          our service.
        </p>

        <p className='mb-4'>
          <strong>Webhook Event Data and Logs:</strong> When you connect
          webhooks to Hookflo:
        </p>
        <ul className='mb-4 list-disc list-inside space-y-1'>
          <li>
            We store event payloads and logs (metadata about events, delivery
            status, and alert notifications).
          </li>
          <li>
            These logs and payloads exist solely to deliver notifications,
            maintain history, and enable debugging.
          </li>
        </ul>
        <p className='mb-4'>Retention policy:</p>
        <ul className='mb-4 list-disc list-inside space-y-1'>
          <li>
            If a webhook is deleted, all related event logs and payloads are
            deleted immediately.
          </li>
          <li>
            If your account is deleted, all associated webhooks and event logs
            are permanently deleted.
          </li>
        </ul>
        <p className='mb-4'>
          We do not retain webhook event content beyond what is necessary for
          service operation.
        </p>

        <p className='mb-4'>
          <strong>Technical Information:</strong> To secure and optimize our
          service, we collect:
        </p>
        <ul className='mb-4 list-disc list-inside space-y-1'>
          <li>IP addresses</li>
          <li>Browser and device metadata</li>
          <li>Error logs</li>
        </ul>

        <p className='mb-4'>
          <strong>Cookies:</strong> We use cookies to keep you logged in,
          maintain session state, and support functionality.
        </p>

        <p className='mb-4'>
          <strong>Third-Party Services:</strong> We rely on trusted third-party
          services to provide infrastructure, authentication, and notifications.
          These services receive only the data necessary to perform their
          functions.
        </p>

        <h2 className='text-lg font-semibold text-white mt-8 mb-2'>
          2. How We Use Your Information
        </h2>
        <ul className='mb-4 list-disc list-inside space-y-1'>
          <li>Authenticate and authorize user access</li>
          <li>Deliver webhook events and notifications</li>
          <li>Maintain webhook history and logs</li>
          <li>Improve, secure, and support our platform</li>
        </ul>
        <p className='mb-4'>
          We do not sell your data or share it for advertising purposes.
        </p>

        <h2 className='text-lg font-semibold text-white mt-8 mb-2'>
          3. How We Protect Your Data
        </h2>
        <ul className='mb-4 list-disc list-inside space-y-1'>
          <li>All data is encrypted in transit and at rest</li>
          <li>Stored securely with strict access controls</li>
          <li>Regular infrastructure and security audits</li>
        </ul>

        <h2 className='text-lg font-semibold text-white mt-8 mb-2'>
          4. Data Retention and Deletion
        </h2>
        <table className='w-full text-left mb-4 border border-zinc-800'>
          <thead>
            <tr className='bg-zinc-800 text-zinc-100'>
              <th className='p-2 border-b border-zinc-700'>Data Type</th>
              <th className='p-2 border-b border-zinc-700'>Retention Policy</th>
            </tr>
          </thead>
          <tbody className='text-zinc-300'>
            <tr>
              <td className='p-2 border-b border-zinc-800'>
                Account Information
              </td>
              <td className='p-2 border-b border-zinc-800'>
                Retained while account is active; deleted upon closure
              </td>
            </tr>
            <tr>
              <td className='p-2 border-b border-zinc-800'>
                Webhook Event Logs
              </td>
              <td className='p-2 border-b border-zinc-800'>
                Retained while webhook exists; deleted upon webhook or account
                deletion
              </td>
            </tr>
            <tr>
              <td className='p-2'>Usage and Technical Logs</td>
              <td className='p-2'>
                Retained as needed for service operation and security
              </td>
            </tr>
          </tbody>
        </table>
        <p className='mb-4'>
          All data is permanently deleted when your account is closed.
        </p>

        <h2 className='text-lg font-semibold text-white mt-8 mb-2'>
          5. Your Rights
        </h2>
        <p className='mb-4'>You have the right to:</p>
        <ul className='mb-4 list-disc list-inside space-y-1'>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate information</li>
          <li>Delete your account and associated data</li>
        </ul>
        <p className='mb-4'>
          To exercise your rights, contact us at{' '}
          <a
            href='mailto:team.hookflo@gmail.com'
            className='underline text-white'
          >
            team.hookflo@gmail.com
          </a>
          .
        </p>

        <h2 className='text-lg font-semibold text-white mt-8 mb-2'>
          6. Changes to This Policy
        </h2>
        <p className='mb-4'>
          We may update this Privacy Policy from time to time as necessary. The
          latest version will always be available at{' '}
          <a href='/privacy-policy' className='underline text-white'>
            hookflo.com/privacy-policy
          </a>
          . By continuing to use our service after updates, you agree to the
          latest version of this policy.
        </p>

        <h2 className='text-lg font-semibold text-white mt-8 mb-2'>
          7. Contact Us
        </h2>
        <p className='mb-4'>
          If you have any questions about this Privacy Policy or how we handle
          your data, contact us at{' '}
          <a
            href='mailto:team.hookflo@gmail.com'
            className='underline text-white'
          >
            team.hookflo@gmail.com
          </a>
          .
        </p>

        <p className='mt-8 text-zinc-400'>
          This policy is effective as of the date listed above and applies to
          all information collected by Hookflo.com, including data collected
          prior to this date.
        </p>
      </div>
    </div>
  );
}
