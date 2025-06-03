import Link from "next/link";
import { Button } from "./ui/button";
import clsx from "clsx";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BuyNowButton } from "./ui/BuyNowButton";
import type { Image as ImageType } from "@prisma/client";
import type { FC } from "react";

interface ItemCardProps {
  id: number | string; // Allow both number and string for flexibility
  name: string;
  slug: string;
  description?: string | null;
  price?: number;
  status: "AVAILABLE" | "COMING_SOON" | "SOLD" | "ARCHIVED";
  images?: (ImageType | string)[];
}

const ItemCard: FC<ItemCardProps> = ({
  id,
  name,
  slug,
  description,
  price,
  status,
  images = [],
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row w-full border border-stone-200 rounded-2xl overflow-hidden font-body bg-white transition-all duration-300 group"
      )}
    >
      <div className="w-full md:w-1/2 relative bg-stone-100 border-b md:border-b-0 md:border-r border-stone-200">
        <div className="aspect-[4/5] md:aspect-auto w-full h-full relative">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {status === "COMING_SOON" && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                Coming Soon
              </span>
            )}
            {status === "SOLD" && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Sold
              </span>
            )}
            {status === "ARCHIVED" && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                Archived
              </span>
            )}
          </div>

          <Carousel opts={{ loop: true }} className="w-full h-full">
            <CarouselContent className="w-full h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="w-full h-full">
                  <div className="relative w-full aspect-[4/5]">
                    <Image
                      src={typeof image === "string" ? image : image.url}
                      alt={`Image of ${name}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </div>
      </div>

      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6">
        <div>
          <Link href={`/products/${slug}`} passHref>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-black mb-3 tracking-tight hover:underline">
              {name}
            </h2>
          </Link>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed tracking-wide">
            {description}
          </p>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed tracking-wide">
            Status: {status}
          </p>
          <p className="text-lg md:text-xl font-semibold text-black mt-2">
            {price ? `$${price.toFixed(2)}` : "Price not available"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <BuyNowButton
            product={{
              id: Number(id), // 👈 converts string to number
              name,
              slug,
              status,
              price: price ?? 0,
              description: description ?? "",
              createdAt: new Date(), // Placeholder, replace with actual value if available
              updatedAt: new Date(), // Placeholder, replace with actual value if available
              images: Array.isArray(images)
                ? images.filter(
                    (img): img is ImageType => typeof img !== "string"
                  )
                : [],
            }}
          />
          <Link href={`/products/${slug}`} passHref>
            <Button variant="secondary" className="w-fit text-sm px-5 py-2">
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
