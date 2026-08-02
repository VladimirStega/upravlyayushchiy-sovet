import { notFound } from "next/navigation";
import { sitePages } from "../../src/generated/site-pages.js";

export const metadata = {
  title: "Управляющий совет",
  description: "Официальный информационный ресурс Управляющего совета МБОУ СОШ № 47 г. Липецка."
};

export default async function SitePage({ params }) {
  const resolvedParams = await params;
  const route = `/${(resolvedParams?.slug ?? []).join("/")}/`;
  const body = sitePages[route];
  if (!body) notFound();
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: body }} />;
}
