import Link from "next/link";

export default function SuccessCheckoutPage() {
  return (
    <section className="bg-white text-black min-h-screen px-6 md:px-12 py-32 font-body">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
          Checkout Successful
        </h1>
        <p className="text-lg md:text-xl mb-8 text-neutral-700 leading-relaxed">
          Thank you for your purchase! Your order has been successfully placed.
          You will receive a confirmation email shortly.
        </p>
        <Link href="/">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-neutral-900 transition">
            Return to Home
          </button>
        </Link>
      </div>
    </section>
  );
}
