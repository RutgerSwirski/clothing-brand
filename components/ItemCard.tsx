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

const imagesPlaceholder = [
  "https://images.pexels.com/photos/2240069/pexels-photo-2240069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/10599963/pexels-photo-10599963.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/32314537/pexels-photo-32314537/free-photo-of-elegant-female-portrait-with-dramatic-lighting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

type ItemCardProps = {
  name: string;
  description: string;
  images?: string[];
  slug?: string;
  available?: boolean;
  comingSoon?: boolean;
  featured?: boolean;
};

const ItemCard = ({
  name,
  description,
  images = imagesPlaceholder,
  slug,
  available,
  comingSoon = false,
  featured = false,
}: ItemCardProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row w-full border border-stone-200 rounded-2xl overflow-hidden font-body bg-white transition-all duration-300",
        {
          "md:hover:scale-[1.01] md:hover:shadow-lg": !featured,
          "md:hover:scale-[1.02] md:hover:shadow-xl": featured,
        }
      )}
    >
      {/* Image Placeholder / Carousel */}
      <div className="w-full md:w-1/2 relative bg-stone-100 border-b md:border-b-0 md:border-r border-stone-200">
        <div className="aspect-[4/5] md:aspect-auto w-full h-full">
          <Carousel
            opts={{
              loop: true,
            }}
            className="w-full h-full"
          >
            <CarouselContent className="w-full h-full">
              {images.map((image, index) => (
                <CarouselItem key={index} className="w-full h-full">
                  <div className="relative w-full aspect-[4/5]">
                    <Image
                      src={image}
                      alt={`Image of ${name}`}
                      fill
                      className="object-cover"
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
        {/* Title + Description */}
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-black mb-3">
            {name}
          </h2>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed tracking-wide">
            {description}
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-wrap items-center gap-4">
          {comingSoon ? (
            <span className="text-xs font-medium tracking-wide text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
              Coming Soon
            </span>
          ) : available ? (
            <Button className="w-fit text-sm px-5 py-2">Buy Now</Button>
          ) : (
            <span className="text-xs font-medium tracking-wide text-red-600 bg-red-100 px-2 py-1 rounded">
              Sold Out
            </span>
          )}

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
