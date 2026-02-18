import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Terms = () => (
  <>
    <SEOHead title="Terms of Service" description="Terms of Service for Darker — website and booking platform for auto detailers." canonicalUrl="https://darkerdigital.com/terms" />
  <div className="min-h-screen" style={{ background: "hsl(215, 50%, 10%)", color: "hsl(0, 0%, 100%)" }}>
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: "hsla(0,0%,100%,0.5)" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm mb-10" style={{ color: "hsla(0,0%,100%,0.4)" }}>Last updated: February 18, 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6" style={{ color: "hsla(0,0%,100%,0.75)" }}>
        <section>
          <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
          <p>By accessing or using Darker ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Description of Service</h2>
          <p>Darker provides a SaaS platform for auto-detailing businesses to create websites, manage bookings, and grow their customer base. The Service includes website hosting, booking management, CRM tools, and related features.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Account Registration</h2>
          <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activity under your account.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Free Trial & Subscription</h2>
          <p>Darker offers a 14-day free trial. After the trial period, a paid subscription is required to continue using premium features. Subscriptions are billed monthly or annually through Stripe, our payment processor.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Refund Policy</h2>
          <p><strong>No refunds are issued after the free trial period ends.</strong> You may cancel your subscription at any time, and your access will continue until the end of the current billing period. Cancellation takes effect at the end of your billing cycle — no partial refunds are provided.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Payment Processing</h2>
          <p>All payments are processed securely by <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer" className="text-accent underline">Stripe</a>. By subscribing, you also agree to Stripe's Terms of Service. We do not store your credit card information on our servers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Data Collection & Storage</h2>
          <p>We collect and store data necessary to provide the Service, including your business information, customer data, and booking records. All data is stored securely using industry-standard encryption. For full details, see our <Link to="/privacy" className="text-accent underline">Privacy Policy</Link>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">8. Email Communications</h2>
          <p>By creating an account, you consent to receive transactional emails (booking confirmations, account updates). You may also receive marketing emails, which you can unsubscribe from at any time in compliance with CAN-SPAM regulations.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">9. Acceptable Use</h2>
          <p>You agree not to misuse the Service, including but not limited to: sending spam, uploading malicious content, attempting unauthorized access, or using the Service for illegal purposes.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">10. Termination</h2>
          <p>We may suspend or terminate your account if you violate these Terms. You may delete your account at any time from your Account Settings. Upon deletion, your data will be anonymized and purged after 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">11. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Darker shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">12. Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">13. Contact</h2>
          <p>Questions about these Terms? Contact us at <a href="mailto:support@darker.com" className="text-accent underline">support@darker.com</a>.</p>
        </section>
      </div>
    </div>
  </div>
  </>
);

export default Terms;
