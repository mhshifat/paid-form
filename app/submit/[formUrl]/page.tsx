import { getFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/form-elements";
import FormSubmitComponent from "@/components/form-submit-component";

export default async function SubmitPage({ params }: { params: { formUrl: string } }) {
  const form = await getFormContentByUrl(params.formUrl);
  if (!form) throw new Error("Form not found!");
  const formContent = JSON.parse(form.content) as FormElementInstance[];
  return (
    <FormSubmitComponent
      formUrl={params.formUrl}
      content={formContent}
    />
  )
}