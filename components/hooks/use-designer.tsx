"use client";

import { useContext } from "react";
import { DesignerContext } from "../contexts/designer-context";

export default function useDesigner() {
  const res = useContext(DesignerContext);
  if (!res) throw new Error("useDesigner must be used within a DesignerContext");
  return res;
}