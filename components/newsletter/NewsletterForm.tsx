"use client";

import axios from "axios";
import { Button } from "../ui/button";
import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post("/api/newsletter", { email });
      if (res.status === 200) {
        alert("Thank you for subscribing!");
        setEmail("");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      alert("There was an error subscribing. Please try again later.");
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
