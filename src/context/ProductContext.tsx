import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Product } from "@/data/products";

export interface FirestoreCategory {
  id: string;
  name: string;
  emoji: string;
}

interface ProductContextType {
  products: Product[];
  categories: FirestoreCategory[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<FirestoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeCategories: (() => void) | undefined;
    let productsLoaded = false;
    let categoriesLoaded = false;

    const checkAllLoaded = () => {
      if (productsLoaded && categoriesLoaded) {
        setLoading(false);
      }
    };

    try {
      // Real-time listener for products — purely reads from Firestore, no seeding
      unsubscribeProducts = onSnapshot(
        collection(db, "products"),
        (snapshot) => {
          const productsList = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as Product
          );
          setProducts(productsList);
          productsLoaded = true;
          checkAllLoaded();
        },
        (err) => {
          console.error("Error fetching products:", err);
          setProducts([]);
          setError("Live products are currently unavailable.");
          productsLoaded = true;
          checkAllLoaded();
        }
      );

      // Real-time listener for categories — purely reads from Firestore, no seeding
      unsubscribeCategories = onSnapshot(
        collection(db, "categories"),
        (snapshot) => {
          const categoriesList = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as FirestoreCategory
          );
          setCategories(categoriesList);
          categoriesLoaded = true;
          checkAllLoaded();
        },
        (err) => {
          console.error("Error fetching categories:", err);
          setCategories([]);
          categoriesLoaded = true;
          checkAllLoaded();
        }
      );
    } catch (err: unknown) {
      console.error("Error setting up Firestore listeners:", err);
      setProducts([]);
      setCategories([]);
      setError(err instanceof Error ? err.message : "Failed to connect to database.");
      setLoading(false);
    }

    return () => {
      unsubscribeProducts?.();
      unsubscribeCategories?.();
    };
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
