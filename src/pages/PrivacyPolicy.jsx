import PageTransition from '../components/PageTransition';
import PageHero from '../components/ui/PageHero';
import { BRAND, CONTACT } from '../constants';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'When you submit an inquiry, request a callback, or contact us, we may collect your name, phone number, email address and any details you choose to share about the vehicle you are interested in. We do not collect payment information through this website.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use the information you provide solely to respond to your inquiries, share vehicle details, arrange viewings or test drives, and provide after-sales support. We may contact you by phone, WhatsApp or email regarding your request.',
  },
  {
    title: '3. Sharing of Information',
    body: 'We do not sell, rent or trade your personal information. We may share limited details with trusted financing or logistics partners only when necessary to fulfil a request you have made, and only with your knowledge.',
  },
  {
    title: '4. Data Security',
    body: 'We apply reasonable administrative and technical safeguards to protect your information. While no method of transmission over the internet is completely secure, we work to protect your data and limit access to authorised team members only.',
  },
  {
    title: '5. Cookies & Analytics',
    body: 'This website may use basic cookies and analytics to understand how visitors interact with our pages, helping us improve the experience. You can disable cookies through your browser settings at any time.',
  },
  {
    title: '6. Your Rights',
    body: 'You may request access to, correction of, or deletion of the personal information we hold about you at any time by contacting us using the details below.',
  },
  {
    title: '7. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date.',
  },
];

export default function PrivacyPolicy() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Your trust matters to us. This policy explains how ${BRAND.name} handles the information you share with us.`}
      />

      <article className="mx-auto max-w-3xl container-px py-16">
        <p className="text-sm font-medium text-ink-400">Last updated: June 2026</p>

        <div className="mt-10 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-bold text-ink">{s.title}</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-ink-600">{s.body}</p>
            </section>
          ))}

          <section className="rounded-3xl border border-ink-100 bg-mist-100 p-8">
            <h2 className="font-display text-xl font-bold text-ink">8. Contact Us</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-ink-600">
              For any questions about this Privacy Policy or your personal data, please reach us at{' '}
              <a href={CONTACT.emailHref} className="font-semibold text-brand hover:underline">
                {CONTACT.email}
              </a>{' '}
              or call{' '}
              <a href={CONTACT.phoneHref} className="font-semibold text-brand hover:underline">
                {CONTACT.phone}
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </PageTransition>
  );
}
