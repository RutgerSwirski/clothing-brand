import Link from "next/link";
import { Button } from "./ui/button";
import clsx from "clsx";

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
  images,
  slug,
  available,
  comingSoon = false,
  featured = false,
}: ItemCardProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row w-full border border-black/10 rounded-lg overflow-hidden shadow-sm font-body bg-white transition-all",
        {
          "md:hover:scale-[1.01] md:hover:shadow-lg": !featured,
          "md:hover:scale-[1.02] md:hover:shadow-xl": featured,
        }
      )}
    >
      {/* Image Placeholder / Carousel */}
      <div className="w-full md:w-1/2 aspect-[4/5] bg-neutral-100 flex items-center justify-center text-sm text-neutral-500 tracking-wider font-mono border-b md:border-b-0 md:border-r border-black/10">
        carousel coming soon
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-between gap-6">
        {/* Title + Description */}
        <div>
          <h2 className="text-2xl md:text-3xl font-heading tracking-wide mb-3 text-black">
            {name}
          </h2>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-wrap items-center gap-4">
          {comingSoon ? (
            <span className="text-sm text-yellow-600 font-semibold">
              Coming Soon
            </span>
          ) : available ? (
            <Button className="w-fit">Buy Now</Button>
          ) : (
            <span className="text-sm text-red-600 font-semibold">Sold Out</span>
          )}

          <Link href={`/products/${slug}`} passHref>
            <Button variant="secondary" className="w-fit">
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
