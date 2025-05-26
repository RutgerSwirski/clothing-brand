"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

const ProductPage = () => {
  const { slug } = useParams();

  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await axios.get(`/api/products/${slug}`);
      return response.data;
    },
    enabled: !!slug, // Only run the query if slug is defined
  });

  console.log("Product Data:", productData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading product</div>;
  }

  return (
    <div className="md:px-24 px-4 py-12">
      <h1 className="text-4xl md:text-6xl font-bold tracking-wide text-center my-16 font-heading">
        {productData.name}
      </h1>

      <img
        src={productData.imageUrl}
        alt={productData.name}
        className="w-full md:w-1/2 mx-auto mb-8"
      />

      <p className="text-lg md:text-xl mb-4">{productData.description}</p>

      <p className="text-2xl font-bold mb-4">${productData.price}</p>

      <div className="flex justify-center items-center gap-4">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          Add to Cart
        </button>

        <span>{productData.available ? "In Stock" : "Out of Stock"}</span>
      </div>
    </div>
  );
};

export default ProductPage;
