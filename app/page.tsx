import ItemCard from "@/components/ItemCard";
import HeroImage from "../public/images/hero.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        {/* Background image */}
        {/* <div
          className="absolute inset-0 z-0 bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: `url(${HeroImage.src})`,
          }}
        /> */}

        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/videos/VHSPlaceholder.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Overlay (darkens image slightly) */}
        <div className="absolute inset-0 z-10 bg-black/50" />

        {/* Hero Content */}
        <div className="absolute top-1/2 left-6 md:left-24 transform -translate-y-1/2 z-20 text-white max-w-xl">
          <h1 className="text-6xl md:text-7xl font-heading font-extrabold tracking-tight leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            Studio
            <br />
            Remade.
          </h1>

          <p className="text-lg md:text-2xl font-body font-light tracking-widest mb-8 text-neutral-200">
            Nothing New. Everything Remade.
          </p>
          <Link href="/products" passHref>
            <Button className="transition-transform hover:scale-105 hover:bg-white/90 hover:text-black">
              View Products
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce text-white text-sm tracking-wider font-mono">
          scroll
        </div>
      </section>

      {/* Second Section */}
      <section className="py-32 px-8 md:px-24 text-black bg-stone-100">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
          {/* Text Section */}
          <div className="w-full md:w-1/2">
            <div className="border border-dashed border-neutral-300 rounded-md p-4 md:p-6">
              <h2 className="tracking-wide text-3xl md:text-5xl font-heading font-bold mb-8 text-left md:text-center">
                About Studio Remade{" "}
                <span className="ml-1 animate-pulse text-green-500">█</span>
              </h2>
              <hr className="border-t border-stone-300 w-12 mx-auto mb-8" />
              <p className="text-lg md:text-xl font-body leading-relaxed md:leading-loose max-w-prose mx-auto md:mx-0">
                Studio Remade started in a small room, with a secondhand sewing
                machine and a lot of trial and error. I'm not classically
                trained — just self-taught and deeply drawn to the idea that
                clothing can be both function and feeling. Every piece I make
                carries a bit of where I'm at — imperfect, expressive,
                intentional. This is a one-person studio. Every stitch, every
                seam, every idea — built by hand, from scratch.
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <div className="aspect-square bg-neutral-200 rounded-lg shadow-sm flex items-center justify-center text-sm text-neutral-500 font-mono">
              <video
                className="w-full h-full object-cover rounded-lg border border-stone-300 shadow-inner"
                src="/videos/SewingVHS.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className="aspect-square bg-neutral-200 rounded-lg shadow-sm flex items-center justify-center text-sm text-neutral-500 font-mono">
              <Image
                src="/images/sewingfabric.jpg"
                alt="Sewing fabric"
                className="w-full h-full object-cover rounded-lg border border-stone-300 shadow-inner"
                width={500}
                height={500}
              />
            </div>
            <div className="aspect-square bg-neutral-200 rounded-lg shadow-sm flex items-center justify-center text-sm text-neutral-500 font-mono">
              <video
                className="w-full h-full object-cover rounded-lg border border-stone-300 shadow-inner"
                src="/videos/workinprogress.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className="aspect-square bg-neutral-200 rounded-lg shadow-sm flex items-center justify-center text-sm text-neutral-500 font-mono">
              <video
                className="w-full h-full object-cover rounded-lg border border-stone-300 shadow-inner"
                src="/videos/sketching.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-4 md:px-24 bg-stone-200 text-black">
        <h2 className="tracking-wide text-3xl md:text-5xl font-bold text-center mb-8 font-heading">
          Featured Items
        </h2>

        <hr className="border-t border-stone-300 w-12 mx-auto mb-8" />

        <p className="text-lg md:text-xl text-center mb-12 w-3/4 mx-auto font-body">
          Discover a selection of unique pieces that embody the spirit of Studio
          Remade. Each item is crafted with care, using upcycled materials and
          designed to tell a story. Click on any item to learn more about its
          creation and inspiration.
        </p>

        <div className="flex flex-col space-y-12">
          {/* Item 1 */}
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-12">
            {/* Text */}
            <ItemCard
              name="Item 1"
              description="This is a description of item 1."
              slug="item-1"
              featured
            />

            {/* Image */}
            <ItemCard
              name="Item 2"
              description="This is a description of item 2."
              slug="item-2"
              featured
            />
          </div>

          {/* Item 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-12">
            {/* Text */}
            <ItemCard
              name="Item 3"
              description="This is a description of item 3."
              slug="item-3"
              featured
            />

            {/* Image */}
            <ItemCard
              name="Item 4"
              description="This is a description of item 4."
              slug="item-4"
              featured
            />
          </div>
        </div>
      </section>

      <section className="py-32 px-8 md:px-24 bg-stone-50 text-black">
        <h2 className="tracking-wide text-3xl md:text-5xl font-bold text-center mb-8 font-heading">
          Coming Soon
        </h2>

        <hr className="border-t border-stone-300 w-12 mx-auto mb-8" />

        <p className="text-lg md:text-xl text-center mb-8 w-3/4 mx-auto font-body">
          Stay tuned for more exciting items that are on the way! These pieces
          will be available soon, so keep an eye out for updates.
        </p>

        <div className="flex flex-col md:flex-row items-center md:justify-between gap-8">
          <ItemCard
            name="Item 5"
            description="This is a description of item 5."
            slug="item-5"
            comingSoon
          />

          <ItemCard
            name="Item 6"
            description="This is a description of item 6."
            slug="item-6"
            comingSoon
          />
        </div>
      </section>

      <section className="bg-black text-white px-6 md:px-24 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-heading mb-6">
          Stay in the Loop
        </h2>
        <p className="text-lg mb-6 font-body opacity-80">
          Join the Studio Remade mailing list — early drops, behind the scenes &
          more.
        </p>
        <form className="flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="your@email.com"
            className="bg-white text-black px-4 py-2 rounded w-full md:w-1/3"
          />
          <Button>Subscribe</Button>
        </form>
      </section>

      <footer className="py-12 text-center text-sm opacity-50">
        crafted with love
        <br />
        &copy; {new Date().getFullYear()} Studio Remade.
      </footer>
    </div>
  );
}
