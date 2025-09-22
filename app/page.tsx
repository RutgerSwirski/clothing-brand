import ItemCard from "@/components/ItemCard";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 60; // revalidates at most every 60s
export const metadata = {
  title: "Studio Remade",
  description: "Nothing New. Everything Remade.",
};

export default async function Home() {
  // we need to fetch features products

  const pieces = await prisma.piece.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: [
      { featured: "desc" },
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      subtitle: true,
      hero: { select: { url: true, width: true, height: true, alt: true } },
      tags: { select: { tag: { select: { name: true, slug: true } } } },
      techniques: {
        select: { technique: { select: { name: true, slug: true } } },
      },
      year: true,
      season: true,
    },
  });

  console.log("pieces", pieces);

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
          src="/videos/VHSPlaceholderOptimized.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/VHSPoster.jpg"
        />

        {/* Overlay (darkens image slightly) */}
        <div className="absolute inset-0 z-10 bg-black/50" />

        {/* Hero Content */}
        <div className="absolute top-1/2 left-6 md:left-24 transform -translate-y-1/2 z-20 text-white max-w-xl">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight leading-tight md:leading-none drop-shadow">
            Studio
            <br />
            Remade<span className="text-white">.</span>
          </h1>

          <p className="mt-4 text-base md:text-2xl font-light tracking-widest text-neutral-200">
            Nothing New. Everything Remade.
          </p>

          <Link href="/lookbook" passHref>
            <Button className="mt-6 transition-transform hover:scale-105 hover:bg-white/90 hover:text-black">
              View Pieces
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center text-white text-sm tracking-wider">
          <span className="mb-1">scroll</span>
          <div className="w-px h-4 bg-white animate-bounce" />
        </div>
      </section>

      {/* Second Section */}
      <section className="py-32 px-6 md:px-24 bg-stone-100 text-black font-body">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row gap-16 md:gap-24 items-center">
          {/* TEXT SECTION */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight tracking-tight">
              About Studio Remade.{" "}
              <span className="ml-2 animate-pulse text-green-500">█</span>
            </h2>
            <div className="h-[2px] w-16 bg-stone-400 mb-8" />
            <div className="space-y-6 text-lg md:text-xl leading-relaxed tracking-wide">
              <p>
                Studio Remade began in a small room — just me, a sewing machine,
                and a lot of trial and error. I’m not classically trained — just
                stubborn, self-taught, and obsessed with the idea that clothing
                should be both functional and emotional.
              </p>
              <p>
                Everything here is made by hand. Every stitch, seam, mistake,
                and idea comes from a place of honesty. Imperfect. Expressive.
                Intentional.
              </p>
              <p>
                This is a one-person studio. From fabric to final form — every
                piece is imagined, drafted, and constructed by hand.
              </p>
              <p>
                Studio Remade is built on the belief that clothing deserves a
                second life. Most pieces begin with reclaimed fabrics — old
                garments, vintage stock, or forgotten materials. Occasionally,
                I’ll use leftover rolls or sustainable textiles to bring an idea
                to life — always with intention, never for excess.
              </p>
            </div>
          </div>

          {/* MEDIA SECTION */}
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-stone-300 shadow-inner">
              <video
                src="/videos/SewingVHS.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-stone-300 shadow-inner">
              <Image
                src="/images/sewingfabric.jpg"
                alt="Sewing fabric"
                className="absolute inset-0 w-full h-full object-cover"
                width={500}
                height={500}
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-stone-300 shadow-inner">
              <video
                src="/videos/workinprogress.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-stone-300 shadow-inner">
              <video
                src="/videos/sketching.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 md:px-24 bg-stone-200 text-black font-body">
        <div className="mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center tracking-tight mb-6">
            Featured Pieces
          </h2>

          <div className="h-[2px] w-16 bg-stone-400 mx-auto mb-10" />

          <p className="text-base md:text-lg text-center mb-20 max-w-2xl mx-auto text-stone-700 leading-relaxed tracking-wide">
            A curated drop from the cutting table. Each of these pieces carries
            its own story — deconstructed, rebuilt, and reborn from forgotten
            garments.
            <br className="hidden md:block" />
            Click to uncover their transformation.
          </p>

          {/* Featured Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 my-20">
            {/* {featuredProducts.map((product) => (
              <ItemCard
                key={product.id}
                {...product}
                description={product.description ?? undefined}
              />
            ))} */}
          </div>

          {/* Feature Block 1 */}
          {/* <div className="flex flex-col md:flex-row items-center md:justify-between gap-12">
              <ItemCard
                status="AVAILABLE"
                id="item-1"
                name="Item 1"
                description="Oversized boxy jacket made from two vintage canvas coats, finished with raw hems and topstitched pleats."
                slug="item-1"
              />
              <ItemCard
                status="AVAILABLE"
                id="item-2"
                name="Item 2"
                description="Two-tone hoodie spliced from thrifted knitwear and lined with deconstructed shirting."
                slug="item-2"
              />
            </div> */}

          {/* Feature Block 2 */}
          {/* <div className="flex flex-col md:flex-row-reverse items-center md:justify-between gap-12">
              <ItemCard
                id="item-3"
                name="Item 3"
                description="Wide-leg trousers crafted from old military fatigues, restructured with sculptural pleats."
                slug="item-3"
                status="COMING_SOON"
              />
              <ItemCard
                id="item-4"
                name="Item 4"
                description="Cropped denim jacket made from multiple pairs of jeans — with asymmetrical paneling and reinforced stitching."
                slug="item-4"
                status="SOLD"
              />
            </div> */}
        </div>
      </section>

      <section className="bg-black text-white px-6 md:px-24 py-24 text-center font-body">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Stay in the Loop
          </h2>

          <p className="text-base md:text-lg opacity-80 mb-8 leading-relaxed">
            Be the first to know about new drops, behind-the-scenes moments, and
            studio notes. No spam — just thoughtful updates, sometimes with
            thread still on my hands.
          </p>

          <NewsletterForm />

          <p className="text-xs opacity-60 mt-4">
            You can unsubscribe anytime. Your email stays with me.
          </p>
        </div>
      </section>
    </div>
  );
}
