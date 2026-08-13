import { Helmet } from 'react-helmet-async';
import { businessConfig } from '../config/businessConfig';
import { SITE_NAME } from '../config/seoConfig';

export interface SEOProps {
  /** Page title (without brand suffix). */
  title: string;
  /** Meta description, ideally 120–160 characters. */
  description: string;
  /** Optional full canonical URL. If omitted, set `canonicalPath` instead. */
  canonical?: string;
  /** Relative canonical path (e.g. `/leistungen`); joined with the site base URL. */
  canonicalPath?: string;
  /** Optional keywords meta tag. */
  keywords?: string;
  /** Open Graph / Twitter image URL. */
  ogImage?: string;
  /** Optional JSON-LD structured data object (or array of objects). */
  jsonLd?: object | object[];
  /** Set to true to keep the page out of the index (e.g. 404). */
  noindex?: boolean;
}

const BASE_URL = businessConfig.url;
const DEFAULT_OG = businessConfig.images.primary;

/**
 * Reusable SEO component. Renders a unique `<title>` and
 * `<meta name="description">` per page via react-helmet-async,
 * plus canonical, Open Graph, Twitter Card, and optional JSON-LD.
 *
 * Title is rendered as `{title} | {SITE_NAME}` unless the title already
 * contains the brand name.
 */
export default function SEO({
  title,
  description,
  canonical,
  canonicalPath = '/',
  keywords,
  ogImage = DEFAULT_OG,
  jsonLd,
  noindex = false,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ?? `${BASE_URL}${canonicalPath}`;
  const robots = noindex ? 'noindex, follow' : 'index, follow';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robots} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="de_DE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Geographic meta tags */}
      <meta name="geo.region" content={`DE-${businessConfig.address.state}`} />
      <meta name="geo.placename" content={businessConfig.address.city} />
      <meta name="geo.position" content={`${businessConfig.geo.latitude};${businessConfig.geo.longitude}`} />
      <meta name="ICBM" content={`${businessConfig.geo.latitude}, ${businessConfig.geo.longitude}`} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
