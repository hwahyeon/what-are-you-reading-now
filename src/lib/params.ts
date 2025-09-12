import { z } from "zod";

const schema = z.object({
  theme: z.string().trim().toLowerCase().optional().default("light"),
  title: z.string().trim().optional().default(""),
  author: z.string().trim().optional().default(""),
  img: z.url().startsWith("https://").optional(),
  progress: z.coerce.number().int().min(0).max(100).optional(),
});

export type Params = z.infer<typeof schema>;

export function parseParams(sp: URLSearchParams): Params {
  // turn searchParams into plain object
  const obj = Object.fromEntries(sp.entries());
  // validate & fill defaults
  return schema.parse(obj);
}
