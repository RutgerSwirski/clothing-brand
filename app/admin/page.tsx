"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function AdminPage() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // get orders
  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axios.get("/api/orders");
      return response.data;
    },
    enabled: accessGranted, // Only fetch orders if access is granted
  });

  if (!accessGranted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl mb-4">Admin Access Required</h1>
        <input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter admin password"
          className="border p-2 mb-4"
        />
        <button
          onClick={() => {
            if (inputValue === "admin123") {
              setAccessGranted(true);
            } else {
              alert("Incorrect password");
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
      <button
        onClick={() => setAccessGranted(false)}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
}
