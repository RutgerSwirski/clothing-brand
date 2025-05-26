import ItemCard from "@/components/ItemCard";
import HeroImage from "../public/images/hero.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: `url(${HeroImage.src})`,
          }}
        />

        {/* Overlay (darkens image slightly) */}
        <div className="absolute inset-0  z-10 bg-black opacity-50" />

        {/* Hero Content */}
        <div className="absolute top-1/2 left-8 md:left-36 transform -translate-y-1/2 z-20">
          <p className="text-white font-heading tracking-widest mb-6 font-bold text-4xl ">
            NOVAIR
          </p>
          <p className="text-base md:text-2xl font-body font-light tracking-widest mb-6">
            Life is too short to wear boring clothes.
          </p>
          <button className="px-6 py-3 border rounded-md cursor-pointer border-white text-white tracking-wider text-sm font-body hover:bg-white hover:text-black transition duration-300">
            Explore Collection
          </button>
        </div>
      </section>

      {/* Second Section */}
      <section className="py-32 px-8 md:px-24 text-black bg-stone-100">
        <h2 className="tracking-wide text-3xl md:text-5xl font-heading font-bold text-center mb-8">
          about NOVAIR
        </h2>

        <p className="text-lg md:text-xl text-center mb-8 w-3/4 mx-auto">
          I'm just a guy designing and sewing clothes from my little office.
          NOVAIR is my way of expressing my love for fashion and art. I'm
          figuring things out as I go along - teaching myself, failing, learning
          and creating clothes that are infused with my own unique style.
        </p>
      </section>

      <section className="py-32 px-4 md:px-24 bg-stone-200 text-black">
        <h2 className=" tracking-wide text-3xl md:text-5xl font-bold text-center mb-16 font-heading ">
          some of my favorite pieces:
        </h2>

        <div className="flex flex-col space-y-12">
          {/* Item 1 */}
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-12">
            {/* Text */}
            <ItemCard
              name="Item 1"
              description="This is a description of item 1."
              slug="item-1"
            />

            {/* Image */}
            <ItemCard
              name="Item 2"
              description="This is a description of item 2."
              slug="item-2"
            />
          </div>

          {/* Item 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-12">
            {/* Text */}
            <ItemCard
              name="Item 3"
              description="This is a description of item 3."
              slug="item-3"
            />

            {/* Image */}
            <ItemCard
              name="Item 4"
              description="This is a description of item 4."
              slug="item-4"
            />
          </div>
        </div>
      </section>

      <section className="py-32 px-8 md:px-24 bg-stone-50 text-black">
        <h2 className="tracking-wide text-3xl md:text-5xl font-bold text-center mb-8 font-heading">
          what I'm working on now:
        </h2>

        <p className="text-lg md:text-xl text-center mb-8 w-3/4 mx-auto font-body">
          I'm currently working on some new pieces and collections. Stay tuned!
        </p>

        <div className="flex flex-col md:flex-row items-center md:justify-between gap-8">
          <ItemCard
            name="Item 5"
            description="This is a description of item 5."
            slug="item-5"
          />

          <ItemCard
            name="Item 6"
            description="This is a description of item 6."
            slug="item-6"
          />
        </div>
      </section>

      <footer className="py-12 text-center text-sm opacity-50">
        crafted with love
        <br />
        &copy; {new Date().getFullYear()} NOVAIR
      </footer>
    </div>
  );
}
