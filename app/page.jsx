import { homeBody } from "../src/generated/site-pages.js";

export const metadata = {
  title: "Управляющий совет — решения, которые меняют школу",
  description: "Состав, решения, проекты, документы и новости Управляющего совета."
};

export default function HomePage() {
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: homeBody }} />;
}
