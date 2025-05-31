import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UpcycleEnquiryThanksPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-24 font-body bg-stone-50">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Thank you for your enquiry ✂️
        </h1>
        <p className="text-stone-700 text-base md:text-lg leading-relaxed">
          I’ve received your request and will be in touch within 2–3 days. I’m
          looking forward to reworking your garments into something bold,
          personal, and completely one-of-a-kind.
        </p>
        <p className="text-sm text-stone-500">
          If you have any additional thoughts or changes, feel free to reply to
          the confirmation email.
        </p>

        {/* CTA Button */}
        <Link href="/products">
          <Button className="mt-4 px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors">
            View Products
          </Button>
        </Link>
      </div>
    </section>
  );
}
