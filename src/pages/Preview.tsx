import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Globe, Calendar, Bell, Shield, Star } from "lucide-react";

interface LeadData {
  businessName: string;
  serviceType: string;
  firstName: string;
  phone: string;
}

const FEATURES = [
  { icon: Globe, label: "Custom Domain Ready" },
  { icon: Calendar, label: "Online Booking" },
  { icon: Bell, label: "Auto Reminders" },
  { icon: Shield, label: "Deposit Collection" },
];

const Preview = () => {
  const navigate = useNavigate();
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("leadData") || "{}") as LeadData;
      if (!data.businessName) { navigate("/"); return; }
      setLeadData(data);
    } catch { navigate("/"); return; }
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!leadData) return null;

  const slug = leadData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
    }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{
        borderColor: 'rgba(255,255,255,0.08)',
      }}>
        <div>
          <h1 className="text-lg font-bold" style={{ color: '#fff' }}>
            Your site is ready, {leadData.firstName}!
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Preview your custom website below
          </p>
        </div>
        <button
          onClick={() => navigate("/claim")}
          className="group h-12 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          }}
        >
          Claim My Website
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </header>

      {/* Feature badges */}
      <div className="flex items-center justify-center gap-3 flex-wrap py-4 px-4">
        {FEATURES.map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
          }}>
            <Icon className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
            {label}
          </span>
        ))}
      </div>

      {/* Browser chrome + mockup */}
      <div className="flex-1 px-4 md:px-8 lg:px-16 pb-8">
        <div
          className="max-w-5xl mx-auto rounded-2xl overflow-hidden transition-all duration-700"
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: revealed ? '0 0 60px hsla(217, 91%, 60%, 0.1)' : 'none',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          }}
        >
          {/* Browser bar */}
          <div className="flex items-center gap-3 px-4 py-3" style={{
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
            </div>
            <div className="flex-1 h-8 rounded-lg flex items-center px-3 text-xs font-mono" style={{
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.5)',
            }}>
              <Globe className="w-3 h-3 mr-2" style={{ color: '#10b981' }} />
              {slug}.realize.pro
            </div>
          </div>

          {/* Website mockup content */}
          <div className="relative" style={{ background: '#0f172a', minHeight: '60vh' }}>
            {/* Hero mockup */}
            <div className="px-8 md:px-16 py-16 md:py-24">
              <div className="max-w-2xl">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full" style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}>
                  {leadData.serviceType}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: '#fff' }}>
                  {leadData.businessName}
                </h2>
                <p className="text-base md:text-lg mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Professional {leadData.serviceType.toLowerCase()} services. Book online 24/7 — fast, easy, and hassle-free.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <div className="h-12 px-8 rounded-xl flex items-center text-sm font-semibold" style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                  }}>
                    Book Now
                  </div>
                  <div className="h-12 px-8 rounded-xl flex items-center text-sm font-semibold" style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                  }}>
                    View Services
                  </div>
                </div>
              </div>
            </div>

            {/* Services grid mockup */}
            <div className="px-8 md:px-16 pb-16">
              <h3 className="text-xl font-bold mb-6" style={{ color: '#fff' }}>Our Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Interior Detail", "Exterior Detail", "Full Detail"].map((name, i) => (
                  <div key={name} className="rounded-xl p-6" style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <h4 className="font-semibold mb-1" style={{ color: '#fff' }}>{name}</h4>
                    <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Starting from
                    </p>
                    <span className="text-2xl font-bold" style={{ color: '#10b981' }}>
                      ${(i + 1) * 75}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews mockup */}
            <div className="px-8 md:px-16 pb-16">
              <h3 className="text-xl font-bold mb-6" style={{ color: '#fff' }}>Customer Reviews</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { text: "Incredible work! My car looks brand new.", author: "James K." },
                  { text: "Best detailing service in town. Highly recommend!", author: "Sarah M." },
                ].map((review) => (
                  <div key={review.author} className="rounded-xl p-5" style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#f59e0b' }} />
                      ))}
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>"{review.text}"</p>
                    <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>— {review.author}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom social proof bar */}
      <div className="flex items-center justify-center gap-6 py-4 border-t" style={{
        borderColor: 'rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ color: '#10b981' }}>★★★★★</span>{' '}
          Trusted by 200+ auto pros
        </span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
          $2.4M+ in bookings captured
        </span>
      </div>
    </div>
  );
};

export default Preview;
