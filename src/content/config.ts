import type { Testimonial } from "@/components/Testimonial.astro";
import type { Section } from "@/components/core/Section.astro";
import type { LinkButton, PageType } from "@/content/page.types";
import { defineCollection, z } from "astro:content";

const zodPageConfig = z.custom<PageType>();

// Pages collection schema
const pagesCollection = defineCollection({
  type: "content",
  schema: zodPageConfig,
});

const indexSchema = z.intersection(
  z.object({
    banner: z.custom<Section>(),
    features: z.object({
      title: z.string(),
      description: z.string(),
      feature_list: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
          icon: z.string(),
        }),
      ),
    }),
    testimonial: z.custom<Testimonial>(),
    call_to_action: z.object({
      title: z.string(),
      description: z.string(),
      button: z.custom<LinkButton>(),
    }),
  }),
  zodPageConfig,
);

const indexPage = defineCollection({
  type: "content",
  schema: indexSchema,
});

// Export collections
export const collections = {
  about: pagesCollection,
  changelog: pagesCollection,
  contact: pagesCollection,
  features: pagesCollection,
  homepage: indexPage,
  pages: pagesCollection,
};


