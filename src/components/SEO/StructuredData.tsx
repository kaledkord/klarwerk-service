import { Helmet } from 'react-helmet-async';
import { businessConfig, sameAsUrls } from '../../config/businessConfig';

/**
 * Breadcrumb item for BreadcrumbList schema.
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  /** Include Organization + WebSite schemas (render once globally, e.g. in Layout). */
  organization?: boolean;
  /** Include BreadcrumbList schema. Pass breadcrumb items for the current page. */
  breadcrumbs?: BreadcrumbItem[];
  /** Additional custom JSON-LD schema(s) to inject. */
  custom?: object | object[];
}

/**
 * Reusable JSON-LD structured data component for AI and search engine indexing.
 *
 * Injects Organization, WebSite, and BreadcrumbList schemas via react-helmet-async.
 * AI models (ChatGPT, Gemini, Claude, Perplexity) parse JSON-LD to understand
 * entity relationships, site structure, and navigation context.
 *
 * Usage:
 *   <StructuredData organization />                              // global, in Layout
 *   <StructuredData breadcrumbs={[{name:'Home',url:'/'},...]} /> // per-page
 */
export default function StructuredData({
  organization = false,
  breadcrumbs,
  custom,
}: StructuredDataProps) {
  const BASE_URL = businessConfig.url;

  // Organization schema — describes the company entity for AI knowledge graphs
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: businessConfig.name,
    legalName: businessConfig.legalName,
    url: BASE_URL,
    logo: businessConfig.images.logo,
    description: businessConfig.description,
    email: businessConfig.email,
    telephone: businessConfig.phone.raw,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessConfig.address.street,
      addressLocality: businessConfig.address.city,
      addressRegion: businessConfig.address.state,
      postalCode: businessConfig.address.zip,
      addressCountry: businessConfig.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: businessConfig.phone.raw,
      contactType: 'customer service',
      email: businessConfig.email,
      areaServed: businessConfig.serviceArea.regions,
      availableLanguage: ['German'],
    },
    sameAs: sameAsUrls,
  };

  // WebSite schema — defines the site entity and enables sitelinks / search action
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: businessConfig.name,
    description: businessConfig.description,
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'de-DE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/leistungen?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // BreadcrumbList schema — helps AI models understand page hierarchy
  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${BASE_URL}${item.url}`,
        })),
      }
    : null;

  const schemas: object[] = [];
  if (organization) {
    schemas.push(organizationSchema, websiteSchema);
  }
  if (breadcrumbSchema) {
    schemas.push(breadcrumbSchema);
  }
  if (custom) {
    if (Array.isArray(custom)) {
      schemas.push(...custom);
    } else {
      schemas.push(custom);
    }
  }

  if (schemas.length === 0) return null;

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
