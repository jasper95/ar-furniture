"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase/firebase";

export type Model = {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
};

type ModelContextType = {
  models: Model[];
  loading: boolean;
  error: string | null;
  refreshModels: () => Promise<void>;
};

const ModelContext = createContext<ModelContextType>({
  models: [],
  loading: true,
  error: null,
  refreshModels: async () => {},
});

export const useModels = () => useContext(ModelContext);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);

    try {
      const db = getFirestore(firebaseApp);
      const modelsCollection = collection(db, "models");
      const modelsQuery = query(modelsCollection, orderBy("createdAt", "desc"));
      const modelSnapshot = await getDocs(modelsQuery);

      const modelList: Model[] = [];
      modelSnapshot.forEach((doc) => {
        const data = doc.data();
        modelList.push({
          id: doc.id,
          name: data.name,
          url: data.url,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      setModels(modelList);
    } catch (err) {
      console.error("Error fetching models:", err);
      setError("Failed to load models. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <ModelContext.Provider
      value={{
        models,
        loading,
        error,
        refreshModels: fetchModels,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}
