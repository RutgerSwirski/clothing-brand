"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { toast } from "sonner";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/newsletter", { email });
      if (res.status === 200) {
        toast.success("Thanks for subscribing!");
        setEmail("");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-center justify-center gap-4"
    >
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full md:w-1/2 px-5 py-3 rounded-md text-black bg-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
      />
      <Button
        type="submit"
        disabled={!email}
        className="w-full md:w-auto px-6 py-3"
      >
        Subscribe
      </Button>
    </form>
  );
};

export default NewsletterForm;
