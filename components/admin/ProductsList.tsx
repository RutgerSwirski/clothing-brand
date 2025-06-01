"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "../ui/button";
import EditProductModal from "./EditProductModal";
import NewProductModal from "./NewProductModal";
import { toast } from "sonner";
import { Order, Product, Image } from "@prisma/client";

type ProductWithOrdersAndImages = Product & {
  orders: Order[];
  images: Image[];
};

export default function ProductsList({
  products,
}: {
  products: ProductWithOrdersAndImages[];
}) {
  const [editingProduct, setEditingProduct] =
    useState<ProductWithOrdersAndImages | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (product: ProductWithOrdersAndImages) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
      console.error("Failed to delete product", err);
    }
  };

  return (
    <>
      <section className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-1">Products</h2>
            <p className="text-stone-500 text-sm">
              Manage your products here — add, edit, or delete items.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsCreating(true)}>
            + Add New Product
          </Button>
        </div>
      </section>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Table className="w-full text-sm">
          <TableCaption className="text-stone-500">
            All listed products
          </TableCaption>
          <TableHeader className="bg-stone-50 border-b">
            <TableRow>
              <TableHead className="w-1/4 font-semibold text-stone-700">
                Name
              </TableHead>
              <TableHead className="w-1/4 font-semibold text-stone-700">
                Slug
              </TableHead>
              <TableHead className="w-1/4 font-semibold text-stone-700">
                Price
              </TableHead>
              <TableHead className="w-1/4 font-semibold text-stone-700">
                Status
              </TableHead>
              <TableHead className="w-[120px] font-semibold text-stone-700 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-stone-400 py-6"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="truncate">{product.slug}</TableCell>
                  <TableCell>€{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        disabled={product?.orders?.length > 0}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={product?.orders?.length > 0}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCreating && (
        <NewProductModal
          open={isCreating}
          onClose={() => setIsCreating(false)}
        />
      )}
    </>
  );
}
