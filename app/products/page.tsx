"use client";

import ItemCard from "@/components/ItemCard";
import PageHeader from "@/components/PageHeader";
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
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";

// export const metadata = {
//   title: "Products",
//   description: "Browse our collection of products",
// };

export default function ProductsPage() {
  const [category, setCategory] = useAtom(categoryAtom);
  const [availability, setAvailability] = useAtom(availabilityAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [search, setSearch] = useAtom(searchAtom);

  const { data: products, isLoading } = useQuery({
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
  });

  const areFiltersApplied = category || availability || sortBy || search;

  return (
    <div className="md:px-24 px-4 py-12">
      <PageHeader
        title="Products"
        subtitle={`Each piece holds a story — rebuilt, reimagined, and made to last.\nFilter the archive to find what fits your rhythm.`}
      />

      <div>
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
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="coming-soon">Coming Soon</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
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
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin text-stone-500" size={32} />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-stone-500 italic mt-24">
          No products match your filters. Try adjusting them or clearing all.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 my-20">
          {products.map((product: Product) => (
            <ItemCard
              key={product.id}
              {...product}
              id={String(product.id)}
              description={product.description ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
