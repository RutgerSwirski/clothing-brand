"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type SortableImage = {
  url: string;
  order: number;
  id?: number; // Optional ID for the image, can be used as a unique identifier
};

export default function SortableImageList({
  images,
  onChange,
}: {
  images: SortableImage[];
  onChange: (updated: SortableImage[]) => void;
}) {
  const [localImages, setLocalImages] = useState(images);

  useEffect(() => {
    // Sync external state changes (e.g., reset)
    setLocalImages(images);
  }, [images]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localImages.findIndex(
      (i) => String(i.id ?? i.url) === active.id
    );
    const newIndex = localImages.findIndex(
      (i) => String(i.id ?? i.url) === over.id
    );

    const reordered = arrayMove(localImages, oldIndex, newIndex).map(
      (img, i) => ({
        ...img,
        order: i,
      })
    );

    setLocalImages(reordered);
    onChange(reordered);
  };

  const handleRemove = (idOrUrl: string | number) => {
    const filtered = localImages.filter(
      (img) => (img.id ?? img.url) !== idOrUrl
    );
    const reindexed = filtered.map((img, i) => ({ ...img, order: i }));
    setLocalImages(reindexed);
    onChange(reindexed);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localImages.map((img) => String(img.id ?? img.url))} // unique fallback
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {localImages.map((img) => (
            <SortableImageCard
              key={img.id ?? img.url}
              id={String(img.id ?? img.url)}
              url={img.url}
              onDelete={() => handleRemove(img.id ?? img.url)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableImageCard({
  id,
  url,
  onDelete,
}: {
  id: string;
  url: string;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-full h-96 border rounded overflow-hidden flex items-center justify-center bg-muted"
      {...attributes}
      {...listeners}
    >
      <Image src={url} alt={`Image ${id}`} fill className="object-cover" />
      <Button
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onDelete}
      >
        ×
      </Button>
    </div>
  );
}
