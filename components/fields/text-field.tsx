"use client";
import { ReactNode, useEffect } from 'react';
import { MdTextFields } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance } from "../form-elements";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDesigner from '../hooks/use-designer';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Switch } from '../ui/switch';

const type: ElementsType = "TextField";

const extraAttributes = {
  label: "Text field",
  helperText: "Helper Text",
  required: false,
  placeholder: "Value here..."
}

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: MdTextFields,
    label: "Text Field"
  },
  designerComponent: DesignerComponent,
  formComponent: () => <div>Form Component</div>,
  propertiesComponent: PropertiesComponent,
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  placeholder: z.string().max(50),
  required: z.boolean().default(false),
})

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: {
  elementInstance: FormElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      placeholder: element.extraAttributes.placeholder,
      required: element.extraAttributes.required,
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form])

  const applyChanges = (values: PropertiesSchemaType) => {
    updateElement(element.id, {
      ...element,
      extraAttributes: values
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className='space-y-3' onBlur={form.handleSubmit(applyChanges)}>
        <FormField
          control={form.control}
          name='label'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }} />
              </FormControl>
              <FormDescription>
                The label of the field. <br /> It will be displayed above the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='placeholder'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }} />
              </FormControl>
              <FormDescription>
                The placeholder of the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='helperText'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
              <FormControl>
                <Input {...field} onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }} />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br /> It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='required'
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
              <div className='scale-y-0.5'>
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  The helper text of the field. <br /> It will be displayed below the field.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function DesignerComponent({ elementInstance }: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, placeholder, helperText } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>{label}
        {required && "*"}
      </Label>
      <Input readOnly disabled placeholder={placeholder} />
      {helperText && <p className='text-muted-foreground text-[0.8rem]'>{helperText}</p>}
    </div>
  )
}