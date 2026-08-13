import { BASE_URL, OG_IMAGE } from "@/lib/constants";
export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vishal Sharma",
    url: BASE_URL,
    image: OG_IMAGE,
    description:
      "Self-taught vibe coder from Chandigarh, India, turning ideas into working digital products through AI-assisted development.",
    jobTitle: "Vibe Coder",
    sameAs: [
      "https://github.com/yourusername",
      "https://linkedin.com/in/yourusername",
      "https://twitter.com/yourhandle",
    ],
    knowsAbout: [
      "Vibe Coding",
      "Prompt Engineering",
      "AI Prototyping",
      "Product Logic",
      "Web Development",
    ],
  };
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vishal Sharma Portfolio",
    url: BASE_URL,
    description:
      "Portfolio of Vishal Sharma — a self-taught vibe coder building digital products through AI-assisted development.",
    author: {
      "@type": "Person",
      name: "Vishal Sharma",
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
    name: "Vishal Sharma",
    image: `${BASE_URL}/logo.png`,
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
