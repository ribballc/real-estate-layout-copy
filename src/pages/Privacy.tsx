import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Privacy = () => (
  <>
    <SEOHead title="Privacy Policy" description="Privacy Policy for Darker — learn how we handle your data on our website and booking platform." canonicalUrl="https://darkerdigital.com/privacy" />
    <div className="min-h-screen" style={{ background: "hsl(215, 50%, 10%)", color: "hsl(0, 0%, 100%)" }}>
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: "hsla(0,0%,100%,0.5)" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm mb-10" style={{ color: "hsla(0,0%,100%,0.4)" }}>Last updated: February 18, 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6" style={{ color: "hsla(0,0%,100%,0.75)" }}>
        <section>
          <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email, phone number, business details, and customer records you enter. We also collect usage data (pages visited, features used) and device information (browser type, IP address).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. How We Use Your Data</h2>
          <p>Your data is used to: provide and improve the Service, process payments, send transactional emails, provide customer support, and comply with legal obligations.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Data Storage & Security</h2>
          <p>All data is stored securely using Lovable Cloud infrastructure with bank-level encryption (AES-256 at rest, TLS 1.3 in transit). We follow industry best practices for data security including regular backups and access controls.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Payment Processing</h2>
          <p>Payment information is processed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent underline">Stripe</a>. We never store your full credit card number. Stripe is PCI-DSS Level 1 certified.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Email Marketing</h2>
          <p>We may send marketing emails about product updates and tips. You can unsubscribe at any time by clicking the "Unsubscribe" link in any email or updating your preferences in Account Settings. We comply with CAN-SPAM Act requirements.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Cookies</h2>
          <p>We use essential cookies for authentication and session management. Analytics cookies are only loaded after you provide consent. See our <Link to="/cookies" className="text-accent underline">Cookie Policy</Link> for details.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">7. Third-Party Services</h2>
          <p>We use the following third-party services: Stripe (payments), Resend (transactional email). Each has their own privacy policy governing their use of your data.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">8. Your Rights (GDPR)</h2>
          <p>If you are in the EU/EEA, you have the right to: access your data, correct inaccurate data, request deletion of your data, restrict processing, data portability, and object to processing. You can exercise your right to deletion from your Account Settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">9. Data Retention</h2>
          <p>We retain your data for as long as your account is active. When you delete your account, your data is anonymized immediately and permanently purged after 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">10. Children's Privacy</h2>
          <p>Our Service is not directed to children under 13. We do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or through the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">12. Contact</h2>
          <p>For privacy inquiries, contact us at <a href="mailto:privacy@darker.com" className="text-accent underline">privacy@darker.com</a>.</p>
        </section>
      </div>
    </div>
    </div>
  </>
);

export default Privacy;
