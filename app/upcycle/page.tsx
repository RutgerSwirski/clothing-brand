"use client";

import Link from "next/link";

// export const metadata = {
//   title: "Upcycle | NOVAIR",
//   description: "Send me old garments – I’ll send you back wearable art.",
// };

export default function UpcyclePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 md:px-12 py-24 font-body">
      {/* Hero */}
      <h1 className="font-heading text-4xl md:text-6xl mb-4 tracking-wider">
        REBORN BY NOVAIR
      </h1>
      <p className="text-lg md:text-xl mb-12 opacity-80">
        Send me your tired, forgotten clothes. I’ll dismantle them and rebuild a
        unique piece – cut, sewn & signed in my studio.
      </p>

      {/* How-it-works */}
      <ol className="space-y-8 border-l border-white/20 pl-6">
        <li>
          <h3 className="font-heading text-xl mb-2 tracking-wide">
            1&nbsp;· Choose Your Path
          </h3>
          <p>
            <span className="font-semibold">Structured</span> (hoodie /
            jacket)&nbsp;·
            <span className="font-semibold">Draped</span> (top / dress)&nbsp;·
            <span className="font-semibold">Wildcard</span> (I decide)
          </p>
        </li>

        <li>
          <h3 className="font-heading text-xl mb-2 tracking-wide">
            2&nbsp;· Ship Your Garments
          </h3>
          <p>
            You’ll receive a prepaid label. I can combine up to three pieces
            into one reborn item.
          </p>
        </li>

        <li>
          <h3 className="font-heading text-xl mb-2 tracking-wide">
            3&nbsp;· The Rework
          </h3>
          <p>
            2-4 weeks. I document the process – you’ll get photos + a
            handwritten tag describing what your garment became.
          </p>
        </li>

        <li>
          <h3 className="font-heading text-xl mb-2 tracking-wide">
            4&nbsp;· Delivery & Reveal
          </h3>
          <p>
            Final payment, then I ship the finished piece to you with the story
            card.
          </p>
        </li>
      </ol>

      {/* Call to action */}
      <Link
        href="/upcycle/order"
        className="inline-block mt-16 border border-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition"
      >
        Start Your Upcycle
      </Link>
    </section>
  );
}
