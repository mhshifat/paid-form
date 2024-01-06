import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core"
import { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./sidebar-btn-element";
import { ElementsType, FormElement, FormElements } from "./form-elements";
import useDesigner from "./hooks/use-designer";

export default function DragOverlayWrapper() {
  const { elements } = useDesigner();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null)
  
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: (event) => {
      setDraggedItem(null);
    },
    onDragEnd: (event) => {
      setDraggedItem(null);
    },
  })
  
  if (!draggedItem) return null;
  const type = draggedItem.data.current?.type as ElementsType;
  let node = <div>no drag overlay</div>;
  const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtnElement;
  if (isSidebarBtnElement) node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />
  const isDesignerElement = draggedItem?.data?.current?.isDesignerElement;
  if (isDesignerElement) {
    const elementId = draggedItem.data.current?.elementId;
    const element = elements.find(el => el.id === elementId);
    if (!element) node = <div>Element not found</div>;
    const DesignerElementComponent = FormElements[element!.type].designerComponent;
    node = (
      <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer-events-none">
        <DesignerElementComponent elementInstance={element!} />
      </div>
    )
  }
  return (
    <DragOverlay>
      {node}
    </DragOverlay>
  )
}