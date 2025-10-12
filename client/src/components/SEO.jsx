import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description = "Connect with Verified Home Service Providers listed category wise in Amritsar",
  image = "/assets/images/logo.svg",
  type = "website",
}) {
  const siteTitle =
    "Home Services Hub | Platform to connect Customers with Service Providers";
  const finalTitle = title ? `${title} | Home Services Hub` : siteTitle;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content="https://homeserviceshub.in/" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://homeserviceshub.in/" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Geo Tags */}
      <meta name="geo.region" content="IN-PB" />
      <meta name="geo.placename" content="Amritsar" />
      <meta name="geo.position" content="31.6340;74.8723" />
      <meta name="ICBM" content="31.6340, 74.8723" />
    </Helmet>
  );
}
