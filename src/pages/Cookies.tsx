import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Cookies = () => (
  <>
    <SEOHead title="Cookie Policy" description="Cookie Policy for Darker — learn how we use cookies on our website and booking platform." canonicalUrl="https://darkerdigital.com/cookies" />
  <div className="min-h-screen" style={{ background: "hsl(215, 50%, 10%)", color: "hsl(0, 0%, 100%)" }}>
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: "hsla(0,0%,100%,0.5)" }}>
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm mb-10" style={{ color: "hsla(0,0%,100%,0.4)" }}>Last updated: February 18, 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6" style={{ color: "hsla(0,0%,100%,0.75)" }}>
        <section>
          <h2 className="text-lg font-semibold text-white">1. What Are Cookies</h2>
          <p>Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">2. Essential Cookies</h2>
          <p>These cookies are necessary for the Service to function and cannot be disabled. They include: authentication tokens, session management, and security cookies.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">3. Analytics Cookies</h2>
          <p>With your consent, we may use analytics cookies to understand how visitors interact with the Service. These cookies are only loaded after you accept cookies in our consent banner.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">4. Local Storage</h2>
          <p>We use browser localStorage to store your preferences (theme, sidebar state) and cookie consent status. This data never leaves your device.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">5. Managing Cookies</h2>
          <p>You can manage your cookie preferences through the consent banner that appears on your first visit. You can also clear cookies through your browser settings at any time.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">6. Contact</h2>
          <p>Questions about our use of cookies? Contact us at <a href="mailto:privacy@darker.com" className="text-accent underline">privacy@darker.com</a>.</p>
        </section>
      </div>
    </div>
  </div>
  </>
);

export default Cookies;
