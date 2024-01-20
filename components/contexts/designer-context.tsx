"use client";

import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useState } from "react";
import { FormElementInstance } from "../form-elements";

type DesignerContextType = {
  elements: FormElementInstance[];
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: string) => void;
  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;
  updateElement: (id: string, element: FormElementInstance) => void;
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export default function DesignerProvider({ children }: PropsWithChildren) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null);

  const addElement = useCallback((index: number, element: FormElementInstance) => {
    setElements(prev => {
      const newElements = structuredClone(prev);
      newElements.splice(index, 0, element);
      return newElements;
    })
  }, [])
  const removeElement = useCallback((id: string) => {
    setElements(prev => {
      const newElements = structuredClone(prev);
      return newElements.filter(el => el.id !== id);
    })
  }, [])
  const updateElement = useCallback((id: string, element: FormElementInstance) => {
    setElements(prev => {
      const newElements = structuredClone(prev);
      return newElements.map(el => el.id === id ? element : el);
    })
  }, [])
  return (
    <DesignerContext.Provider value={{
      elements,
      setElements,
      addElement,
      removeElement,
      selectedElement,
      setSelectedElement,
      updateElement
    }}>
      {children}
    </DesignerContext.Provider>
  )
}