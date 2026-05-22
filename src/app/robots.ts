import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://harborsync.app";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/pricing", "/apply", "/contact", "/donate", "/faq", "/demo", "/sign-in"],
      disallow: ["/admin", "/dashboard", "/records", "/documents", "/settings", "/profile", "/children"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
