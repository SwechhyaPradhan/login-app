import { useState, useEffect } from "react";

// Custom hook that fetches products from dummy.json
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from public/data/dummy.json
        const response = await fetch("/data/dummy.json");

        // Check if fetch was successful
        if (!response.ok) {
          throw new Error("Failed to fetch products. Please try again.");
        }

        const data = await response.json();

        // Our data has products inside "products" key
        setProducts(data.products || []);

      } catch (err) {
        setError(err.message);
      } finally {
        // Always stop loading whether success or error
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // runs once when component mounts

  return { products, loading, error };
}