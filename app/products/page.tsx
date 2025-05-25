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

const ProductsPage = () => {
  const [category] = useAtom(categoryAtom);
  const [availability] = useAtom(availabilityAtom);
  const [sortBy] = useAtom(sortByAtom);
  const [search] = useAtom(searchAtom);

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

  return (
    <div className="md:px-24 px-4 py-12">
      <h1 className="text-4xl md:text-6xl font-bold tracking-wide text-center my-16 font-heading">
        Products
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <Input
          type="text"
          placeholder="Search products..."
          className="w-full md:w-1/2"
        />

        <div className="w-full flex flex-wrap gap-4 justify-start md:justify-end">
          <div className="w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-full min-w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="tops">Tops</SelectItem>
                  <SelectItem value="bottoms">Bottoms</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="outerwear">Outerwear</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto">
            <Select>
              <SelectTrigger className="w-full min-w-[150px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="pre-order">Pre-order</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto">
            <Select>
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

          <button>Clear All</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2   gap-8 my-16">
        {products.map((product) => (
          <ItemCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            slug={product.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
