import { FC, ElementType } from "react";
import { TextFieldFormElement } from "./fields/text-field";

export type ElementsType = "TextField";

export type FormElement = {
  type: ElementsType;
  construct: (id: string) => FormElementInstance;
  designerComponent: FC<{
    elementInstance: FormElementInstance
  }>; 
  formComponent: FC<{
    elementInstance: FormElementInstance
  }>; 
  propertiesComponent: FC<{
    elementInstance: FormElementInstance
  }>;
  designerBtnElement: {
    icon: ElementType;
    label: string;
  }
}

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>
}

type FormElementsType = {
  [key in ElementsType]: FormElement;
}

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement
}