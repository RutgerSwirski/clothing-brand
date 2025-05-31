import Link from "next/link";
import { Button } from "./ui/button";
import clsx from "clsx";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

type ItemCardProps = {
  name: string;
  description: string;
  images?: string[];
  slug?: string;
  isAvailable?: boolean;
  comingSoon?: boolean;
  featured?: boolean;
};

const ItemCard = ({
  name,
  description,
  images = [],
  slug,
  isAvailable,
  comingSoon = false,
  featured = false,
}: ItemCardProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row w-full border border-stone-200 rounded-2xl overflow-hidden font-body bg-white transition-all duration-300 group",
        {
          "md:hover:scale-[1.01] md:hover:shadow-lg": !featured,
          "md:hover:scale-[1.02] md:hover:shadow-xl": featured,
        }
      )}
    >
      {/* Image section */}
      <div className="w-full md:w-1/2 relative bg-stone-100 border-b md:border-b-0 md:border-r border-stone-200">
        <div className="aspect-[4/5] md:aspect-auto w-full h-full relative">
          {/* Badges on top of image */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {comingSoon && (
              <span className="text-xs uppercase font-semibold bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full shadow-sm">
                Coming Soon
              </span>
            )}
            {!isAvailable && !comingSoon && (
              <span className="text-xs uppercase font-semibold bg-red-200 text-red-800 px-3 py-1 rounded-full shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          <Carousel opts={{ loop: true }} className="w-full h-full">
            <CarouselContent className="w-full h-full">
              {images.map((image: { url: string } | string, index) => (
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

      {/* Content */}
      <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-black mb-3">
            {name}
          </h2>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed tracking-wide">
            {description}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            className="w-fit text-sm px-5 py-2"
            disabled={!isAvailable || comingSoon}
          >
            Buy Now
          </Button>

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
