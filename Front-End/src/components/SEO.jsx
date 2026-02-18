// components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, image, url, schema }) => {
  const siteName = "Storely"; // اسم المنصة الأم

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags (لـ فيسبوك وغيره) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Tags (لـ تويتر) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) - مهم جداً للمنتجات */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;