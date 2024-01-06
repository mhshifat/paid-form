"use client";

import { Form } from "@prisma/client";
import PreviewDialogBtn from "./preview-dialog-btn";
import SaveFormBtn from "./save-form-btn";
import PublishFormBtn from "./publish-form-btn";
import Designer from "./designer";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import DragOverlayWrapper from "./drag-overlay-wrapper";

export default function FormBuilder({ form }: { form: Form }) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5
    }
  })
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext
      sensors={sensors}
    >
      <div className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form:</span>
            {form.name}
          </h2>

          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form?.published && (
              <>
                <SaveFormBtn />
                <PublishFormBtn />
              </>
            )}
          </div>
        </nav>

        <div className="bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] flex w-full flex-grow justify-center items-center relative overflow-y-auto h-[200px] bg-accent">
          <Designer />
        </div>
      </div>
      <DragOverlayWrapper />
    </DndContext>
  )
}