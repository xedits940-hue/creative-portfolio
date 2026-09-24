import { BASE_URL, OG_IMAGE } from "@/lib/constants";
export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vishal Sharma",
    url: BASE_URL,
    image: OG_IMAGE,
    description:
      "Founder and Creative Director at VTECH STUDIOS, specializing in cinematic motion design, digital production, and creative engineering.",
    jobTitle: "Founder & Creative Director",
    worksFor: {
      "@type": "Organization",
      name: "VTECH STUDIOS",
    },
    sameAs: [
      "https://github.com/yourusername",
      "https://linkedin.com/in/yourusername",
      "https://twitter.com/yourhandle",
    ],
    knowsAbout: [
      "Creative Direction",
      "Motion Design",
      "Digital Production",
      "Video Editing",
      "Web Engineering",
    ],
  };
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VTECH STUDIOS",
    url: BASE_URL,
    description:
      "Official studio portfolio of VTECH STUDIOS — digital production, motion, and creative web engineering.",
    author: {
      "@type": "Organization",
      name: "VTECH STUDIOS",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "VTECH STUDIOS",
    image: `${BASE_URL}/vtech-studios-logo.png`,
    "@id": BASE_URL,
    url: BASE_URL,
    telephone: "",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "",
      postalCode: "",
      addressCountry: "",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
    </>
  );
}
