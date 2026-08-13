import { Helmet } from 'react-helmet-async';
import { businessConfig, sameAsUrls } from '../../config/businessConfig';

/**
 * Injects a <script type="application/ld+json"> tag with LocalBusiness + HouseCleaning
 * structured data. Renders globally on every page via Layout.
 */
export default function LocalBusinessSchema() {
  const { address, geo, hours, services, serviceArea, reviews, images } = businessConfig;

  const openingHoursSpecification = hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.day,
      opens: h.open,
      closes: h.close,
    }));

  const offerCatalog = {
    '@type': 'OfferCatalog',
    name: 'Reinigungsdienstleistungen',
    itemListElement: services.map((service, i) => ({
      '@type': 'Offer',
      position: i + 1,
      itemOffered: {
        '@type': 'Service',
        name: service,
      },
    })),
  };

  const areaServed = serviceArea.locations.map((loc) => ({
    '@type': 'City',
    name: loc.name,
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HouseCleaning'],
    '@id': `${businessConfig.url}/#business`,
    name: businessConfig.name,
    legalName: businessConfig.legalName,
    description: businessConfig.description,
    url: businessConfig.url,
    telephone: businessConfig.phone.raw,
    email: businessConfig.email,
    image: images.primary,
    logo: images.logo,
    priceRange: businessConfig.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHoursSpecification,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: reviews.ratingValue,
      reviewCount: reviews.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    hasOfferCatalog: offerCatalog,
    areaServed,
    sameAs: sameAsUrls,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
