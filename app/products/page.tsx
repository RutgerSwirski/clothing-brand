import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 3600; // Revalidate once per hour (ISR)

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string | null;
    availability?: string | null;
    sortBy?: string | null;
    search?: string;
  };
}) {
  const rawCategory = searchParams.category || "all";
  const rawAvailability = searchParams.availability || "all";
  const sortBy = searchParams.sortBy || "createdAt";
  const search = searchParams.search || "";

  const category = rawCategory !== "all" ? rawCategory : null;
  const availability = rawAvailability !== "all" ? rawAvailability : null;

  const statusMap: Record<string, ProductStatus> = {
    available: ProductStatus.AVAILABLE,
    sold: ProductStatus.SOLD,
    "coming-soon": ProductStatus.COMING_SOON,
    archived: ProductStatus.ARCHIVED,
  };

  const status = availability ? statusMap[availability] : undefined;

  const sortField =
    sortBy === "price" || sortBy === "name" ? sortBy : "createdAt";
  const sortDirection = "asc"; // Optional: switch to "desc" if needed per field

  const areFiltersApplied =
    category !== null ||
    status !== undefined ||
    (search && search.trim() !== "");

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      description: true,
      status: true,
    },
    where: {
      ...(category && { category }),
      ...(status && { status }),
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
    orderBy: {
      [sortField]: sortDirection,
    },
  });

  return (
    <div className="md:px-24 px-4 py-12">
      <PageHeader
        title="Products"
        subtitle={`Each piece holds a story — rebuilt, reimagined, and made to last.\nFilter the archive to find what fits your rhythm.`}
      />

      <form
        method="GET"
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between my-8"
      >
        {/* Search on the left */}
        <div className="w-full sm:w-1/2">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-stone-600">Search</span>
            <Input
              name="search"
              type="text"
              placeholder="Search products..."
              defaultValue={search}
              className="w-full"
            />
          </label>
        </div>

        {/* Filters + actions on the right */}
        <div className="flex flex-wrap gap-4 items-end sm:justify-end w-full sm:w-auto">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-stone-600">Category</span>
            <Select name="category" defaultValue={rawCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-stone-600">Availability</span>
            <Select name="availability" defaultValue={rawAvailability}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="coming-soon">Coming Soon</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-stone-600">Sort By</span>
            <Select name="sortBy" defaultValue={sortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="createdAt">Newest</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>

          <div className="flex gap-3 items-center pt-1">
            <Button type="submit" className="w-full sm:w-auto">
              Apply Filters
            </Button>

            {areFiltersApplied && (
              <Link
                href="/products"
                className="text-sm underline text-stone-500 hover:text-black whitespace-nowrap"
              >
                Clear Filters
              </Link>
            )}
          </div>
        </div>
      </form>

      {products.length === 0 ? (
        <p className="text-center text-stone-500 italic mt-24">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 my-20">
          {products.map((product) => (
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
