import Link from "next/link";
import { Button } from "./ui/button";

type ItemCardProps = {
  name: string;
  description: string;
  images?: string[];
  slug?: string;
  available?: boolean;
  comingSoon?: boolean;
};

const ItemCard = ({
  name,
  description,
  images,
  slug,
  available,
  comingSoon = false,
}: ItemCardProps) => {
  console.log("ItemCard Props:", {
    name,
    description,
    images,
    slug,
    available,
    comingSoon,
  });

  return (
    <div className="flex flex-col md:flex-row w-full border border-black/10 rounded-lg overflow-hidden shadow-sm font-body transition-all bg-white  ">
      {/* Image/Carousel Placeholder */}
      <div className="w-full md:w-1/2 h-80 bg-neutral-100  flex items-center justify-center text-sm text-neutral-500 tracking-wider font-mono">
        carousel coming soon
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading tracking-wide mb-4 text-black ">
            {name}
          </h2>

          <p className="text-sm md:text-base text-neutral-700  leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-8">
          {/* if is coming soon then its not available yet, if coming sson show coming soon, if available then allow buy if not the sold out */}
          {comingSoon ? (
            <span className="text-sm text-yellow-600 font-semibold">
              Coming Soon
            </span>
          ) : available ? (
            <Button>Buy Now</Button>
          ) : (
            <span className="text-sm text-red-600 font-semibold">Sold Out</span>
          )}

          {/* View Button */}

          <Link href={`/products/${slug}`}>
            <Button variant="secondary">View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
