"use client";

import ItemCard from "@/components/ItemCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  availabilityAtom,
  categoryAtom,
  searchAtom,
  sortByAtom,
} from "@/lib/atoms";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";

// export const metadata = {
//   title: "Products",
//   description: "Browse our collection of products",
// };

export default function ProductsPage() {
  const [category, setCategory] = useAtom(categoryAtom);
  const [availability, setAvailability] = useAtom(availabilityAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [search, setSearch] = useAtom(searchAtom);

  const { data: products } = useQuery({
    queryKey: ["products", { category, availability, sortBy, search }],
    queryFn: async () => {
      const response = await axios.get("/api/products", {
        params: {
          category: category || "all",
          availability,
          sortBy,
          search,
        },
      });

      return response.data;
    },
    initialData: [],
  });

  const areFiltersApplied = category || availability || sortBy || search;

  return (
    <div className="md:px-24 px-4 py-12">
      <div className="mx-auto max-w-3xl px-6 md:px-12 py-24 font-body">
        <h1 className="font-heading text-4xl md:text-6xl mb-4 tracking-wider text-center my-16">
          PRODUCTS
        </h1>

        <p className="text-lg md:text-xl mb-12 opacity-80">
          Each piece here was made by hand — sometimes experimental, sometimes
          imperfect, always intentional. Use the filters to explore the
          collection or find something that feels right.
        </p>
      </div>

      <div className="bg-stone-100 text-black p-4 md:p-6 rounded-lg shadow-sm mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full md:w-1/2 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-4 w-full md:w-auto justify-start md:justify-end items-center">
            {areFiltersApplied && (
              <button
                className="text-xs bg-stone-200 px-3 py-1 rounded-full hover:bg-stone-300"
                onClick={() => {
                  setCategory("");
                  setAvailability("");
                  setSortBy("");
                  setSearch("");
                }}
              >
                Clear All
              </button>
            )}
            <div className="w-full sm:w-auto">
              <Select
                value={category || "all"}
                onValueChange={(value) => {
                  setCategory(value === "all" ? "" : value);
                }}
              >
                <SelectTrigger className="w-full min-w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="tops">Tops</SelectItem>
                    <SelectItem value="bottoms">Bottoms</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="outerwear">Outerwear</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={availability || "all"}
                onValueChange={(value) => {
                  setAvailability(value === "all" ? "" : value);
                }}
              >
                <SelectTrigger className="w-full min-w-[150px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Availability</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="pre-order">Pre-order</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <Select
                value={sortBy || "newest"}
                onValueChange={(value) => {
                  setSortBy(value === "newest" ? "" : value);
                }}
              >
                <SelectTrigger className="w-full min-w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price-low-to-high">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high-to-low">
                      Price: High to Low
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-stone-500 italic mt-24">
          No products match your filters. Try adjusting them or clearing all.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-20">
          {products.map((product) => (
            <ItemCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
