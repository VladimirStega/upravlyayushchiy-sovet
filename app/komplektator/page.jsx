import { checklistBody } from "../../src/generated/site-pages.js";

export const metadata = {
  title: "Комплектатор материалов",
  description: "Рабочая таблица подготовки материалов по 30 критериям конкурса."
};

export default function ChecklistPage() {
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: checklistBody }} />;
}
