import { getFormById } from "@/actions/form";
import FormBuilder from "@/components/form-builder";

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const form = await getFormById(Number(id));
  if (!form) throw new Error("Form not found!");
  return (
    <FormBuilder form={form} />
  )
}