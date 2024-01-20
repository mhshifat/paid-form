import { FC, ElementType } from "react";
import { TextFieldFormElement } from "./fields/text-field";

export type ElementsType = "TextField";
export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
  type: ElementsType;
  construct: (id: string) => FormElementInstance;
  designerComponent: FC<{
    elementInstance: FormElementInstance
  }>; 
  formComponent: FC<{
    elementInstance: FormElementInstance;
    submitValue?: (key: string, value: string) => void;
    isInvalid?: boolean;
    defaultValue?: string;
  }>; 
  propertiesComponent: FC<{
    elementInstance: FormElementInstance
  }>;
  designerBtnElement: {
    icon: ElementType;
    label: string;
  }
  validate: (formElement: FormElementInstance, currentValue: string) => boolean; 
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