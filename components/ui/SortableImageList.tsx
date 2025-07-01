"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localImages.findIndex((i) => i.url === active.id);
    const newIndex = localImages.findIndex((i) => i.url === over.id);
    const reordered = arrayMove(localImages, oldIndex, newIndex).map(
      (img, i) => ({ ...img, order: i })
    );

    setLocalImages(reordered);
    onChange(reordered);
  };

  const handleRemove = (url: string) => {
    const filtered = localImages.filter((img) => img.url !== url);
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
        items={localImages.map((img) => img.url)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {localImages.map((img) => (
            <SortableImageCard
              key={img.url}
              id={img.url}
              url={img.url}
              onDelete={() => handleRemove(img.url)}
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
      className="relative w-full h-48 border rounded overflow-hidden flex items-center justify-center bg-muted"
      {...attributes}
      {...listeners}
    >
      <Image src={url} alt="uploaded image" fill className="object-cover" />
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
