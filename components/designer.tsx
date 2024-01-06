"use client";
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';

import DesignerSidebar from "./designer-sidebar";
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ElementsType, FormElementInstance, FormElements } from './form-elements';
import useDesigner from './hooks/use-designer';
import idGenerator from '@/lib/idGenerator';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';

export default function Designer() {
  const { elements, addElement, removeElement, selectedElement, setSelectedElement } = useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true
    }
  })
  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;
      const isDesignerBtnElement = active.data.current?.isDesignerBtnElement;
      const isDroppingOverDesignerArea = over.data.current?.isDesignerDropArea;
      if (isDesignerBtnElement && isDroppingOverDesignerArea) {
        const type = active.data.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf = over?.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf = over?.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;
      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        const overId = over?.data?.current?.elementId;
        const overElementIndex = elements.findIndex(el => el.id === overId);
        if (overElementIndex === -1) throw new Error("Element not found");
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) indexForNewElement = overElementIndex + 1;
        addElement(indexForNewElement, newElement);
        return;
      }

      const isDraggingDesignerElement = active?.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;
      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active?.data?.current?.elementId;
        const overId = over?.data?.current?.elementId;
        const activeElementIndex = elements.findIndex(el => el.id === activeId);
        const overElementIndex = elements.findIndex(el => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1) throw new Error("Element not found");
        const activeElement = structuredClone(elements[activeElementIndex]);
        removeElement(activeId);
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) indexForNewElement = overElementIndex + 1;
        addElement(indexForNewElement, activeElement);
        return;
      }
    }
  })

  return (
    <div className="flex w-full h-full">
      <div className="p-4 w-full" onClick={() => {
        if (selectedElement) setSelectedElement(null);
      }}>
        <div
          ref={droppable.setNodeRef}
          className={cn("p-4 bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto", {
            "ring-4 ring-primary ring-inset": droppable.isOver
          })}>
          {!droppable.isOver && elements.length === 0 && <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">Drop here</p>}
          {droppable.isOver && elements.length === 0 && (
            <div className='p-4 w-full'>
              <div className='h-[120px] rounded-md bg-primary/20' />
            </div>
          )}
          {elements.length > 0 && (
            <div className='flex flex-col w-full gap-4'>
              {elements.map(element => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>

      <DesignerSidebar />
    </div>
  )
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner(); 
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const DesignerElement = FormElements[element.type].designerComponent;
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true
    }
  });
  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true
    }
  });
  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true
    }
  })

  if (draggable.isDragging) return null;
  return (
    <div onClick={(e) => {
      e.stopPropagation();
      setSelectedElement(element);
    }} ref={draggable.setNodeRef} {...draggable.attributes} {...draggable.listeners} onMouseEnter={() => setMouseIsOver(true)} onMouseLeave={() => setMouseIsOver(false)} className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-accent ring-inset'>
      <div ref={topHalf.setNodeRef} className={cn('absolute w-full h-1/2 rounded-t-md')} />
      <div ref={bottomHalf.setNodeRef} className={cn('absolute bottom-0 w-full h-1/2 rounded-b-md')} />
      {mouseIsOver && (
        <>
          <div className='absolute right-0 h-full'>
            <Button className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500' variant={"outline"} onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}>
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
            <p className='text-muted-foreground text-sm'>Click for properties or drag to move</p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className={cn("absolute top-0 w-full rounded-md rounded-b-none h-[7px] bg-primary")} />
      )}
      {bottomHalf.isOver && (
        <div className={cn("absolute bottom-0 w-full rounded-md rounded-t-none h-[7px] bg-primary")} />
      )}
      <div className={cn('opacity-100 flex w-full h-[120px] items-center rounded-md pointer-events-none bg-accent/40 px-4 py-2', {
        "opacity-30": mouseIsOver,
      })}>
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  )
}