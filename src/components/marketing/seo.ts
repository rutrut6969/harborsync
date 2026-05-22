import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harborsync.app";
const ogImage = `${siteUrl}/og-image.png`;

export function publicMetadata(title: string, description: string, path = "/"): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "HarborSync",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "HarborSync family coordination platform" }],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HarborSync",
  url: siteUrl,
  description: "Mobile-first family health management and caregiver coordination software for families and support organizations.",
  sameAs: []
};
