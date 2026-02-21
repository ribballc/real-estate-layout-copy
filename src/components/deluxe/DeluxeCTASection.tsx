import { ArrowRight } from 'lucide-react';
import type { BusinessProfile } from '@/hooks/useBusinessData';

interface Props {
  profile?: BusinessProfile | null;
  slug?: string;
}

const DeluxeCTASection = ({ profile, slug }: Props) => {
  const businessName = profile?.business_name || 'us';

  return (
    <section className="site-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-white p-12 md:p-20 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[hsl(0,0%,4%)] leading-tight mb-6">
              Ready to see<br />the difference?
            </h2>
            <p className="text-[hsl(0,0%,4%)]/50 text-lg max-w-xl mx-auto mb-10">
              Book your detail with {businessName} today. Online scheduling, instant confirmation, premium results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={slug ? `/site/${slug}/book` : "#contact"} className="book-now-link">
                <button className="bg-[hsl(0,0%,4%)] text-white px-8 py-4 rounded-full text-[15px] font-semibold flex items-center gap-2.5 group hover:bg-[hsl(0,0%,12%)] transition-colors">
                  Book Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              {profile?.phone && (
                <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>
                  <button className="px-8 py-4 rounded-full text-[15px] font-medium text-[hsl(0,0%,4%)]/60 border border-[hsl(0,0%,4%)]/10 hover:border-[hsl(0,0%,4%)]/20 transition-all">
                    Call Us
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeluxeCTASection;
