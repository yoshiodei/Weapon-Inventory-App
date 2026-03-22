'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// import { showToast } from "./ShowToast";
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

interface CollectionsContextType {
  collections: string[];
  addCollection: (collection: string) => void;
  deleteCollection: (collection: string) => void;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export function CollectionsProvider({ children }: { children: React.ReactNode }) {

  const [collections, setCollections] = useState<string[]>([]);

  const fetchCollections = async () => {
    try {
      const ref = doc(db, "collections", "BCEy5VE09YMoTvoqSHIX");

      const snap = await getDoc(ref);

      if (!snap.exists()) {
        return {
          success: false,
          message: "Collections document does not exist",
        };
      }

      const data = snap.data();

      console.log("collection data", data?.data?.collectionList);
      setCollections(data.collectionList as string[]);
    
      // cache in localStorage
      localStorage.setItem("collections-cache", JSON.stringify(data));
    } catch (error: any) {
      console.error("Error fetching collections:", error);

      // fallback to cache
      const cache = localStorage.getItem("collections-cache");
      if (cache) {
        setCollections(JSON.parse(cache));
      }
    }

  };

  useEffect(() => {  
    fetchCollections();
  }, []);

  const addCollection = async(collection: string) => {
    try {
    const docRef = doc(
      db,
      "collections",
      "BCEy5VE09YMoTvoqSHIX"
    );

    await updateDoc(docRef, {
      collectionList: arrayUnion(collection),
    });

    fetchCollections();

    return {
      success: true,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
  }

  const deleteCollection = async(collection: string) => {
    try {
    const ref = doc(db, "collections", "BCEy5VE09YMoTvoqSHIX");

    await updateDoc(ref, {
      collectionList: arrayRemove(collection),
    });

    fetchCollections();

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
  };

  return (
    <CollectionsContext.Provider value={{ collections, addCollection, deleteCollection }}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within CollectionsProvider');
  }
  return context;
}
