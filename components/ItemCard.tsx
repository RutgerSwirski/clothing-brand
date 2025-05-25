import Link from "next/link";

type ItemCardProps = {
  name: string;
  description: string;
  images?: string[];
  slug?: string;
};

const ItemCard = ({ name, description, images, slug }: ItemCardProps) => {
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

        <Link href={`/products/${slug}`}>
          <button className="mt-4 py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 ease-in-out hover:cursor-pointer">
            view details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
