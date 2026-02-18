import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_TWITTER, SITE_URL, DEFAULT_SEO, buildTitle } from '@/lib/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
  /** Extra meta tags for geo targeting etc. */
  extraMeta?: { name: string; content: string }[];
}

const SEOHead = ({
  title,
  description = DEFAULT_SEO.description,
  ogImage = DEFAULT_SEO.ogImage,
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  structuredData,
  extraMeta,
}: SEOHeadProps) => {
  const resolvedTitle = title ? buildTitle(title) : DEFAULT_SEO.title;

  const structuredDataArray = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_TWITTER} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Extra meta tags */}
      {extraMeta?.map((m) => (
        <meta key={m.name} name={m.name} content={m.content} />
      ))}

      {/* Structured Data */}
      {structuredDataArray.map((sd, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(sd)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
