import { useDraggable } from "@dnd-kit/core";
import { FormElement } from "./form-elements";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function SidebarBtnElement({ formElement }: { formElement: FormElement }) {
  const { label, icon: Icon } = formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true
    }
  });

  return (
    <Button ref={draggable.setNodeRef} className={cn("flex flex-col h-[120px] w-[120px] cursor-grab", {
      "ring-2 ring-primary": draggable.isDragging
    })} variant="outline" {...draggable.listeners} {...draggable.attributes}>
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  )
}

export function SidebarBtnElementDragOverlay({ formElement }: { formElement: FormElement }) {
  const { label, icon: Icon } = formElement.designerBtnElement;

  return (
    <Button className={cn("flex flex-col h-[120px] w-[120px] cursor-grab")} variant="outline">
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  )
}