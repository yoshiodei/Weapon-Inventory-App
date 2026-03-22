'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// import { showToast } from "./ShowToast";
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

interface WeaponTypesContextType {
  weaponTypes: string[];
  addWeaponType: (collection: string) => void;
  deleteWeaponType: (collection: string) => void;
}

const WeaponTypesContext = createContext<WeaponTypesContextType | undefined>(undefined);

export function WeaponTypesProvider({ children }: { children: React.ReactNode }) {

  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);

  const fetchWeaponTypes = async () => {
    try {
      const ref = doc(db, "weaponTypes", "NDQHiTORHZRqinvmuwmN");

      const snap = await getDoc(ref);

      if (!snap.exists()) {
        return {
          success: false,
          message: "Weapon types document does not exist",
        };
      }

      const data = snap.data();

      console.log("weapon types data", data?.data?.weaponTypeList);
      setWeaponTypes(data.weaponTypeList as string[]);
    
      // cache in localStorage
      localStorage.setItem("weapon-types-cache", JSON.stringify(data));
    } catch (error: any) {
      console.error("Error fetching weapon types:", error);

      // fallback to cache
      const cache = localStorage.getItem("weapon-types-cache");
      if (cache) {
        setWeaponTypes(JSON.parse(cache));
      }
    }

  };

  useEffect(() => { fetchWeaponTypes() }, []);

  const addWeaponType = async(weaponType: string) => {
    try {
    const docRef = doc(
      db,
      "weaponTypes",
      "NDQHiTORHZRqinvmuwmN"
    );

    await updateDoc(docRef, {
      weaponTypeList: arrayUnion(weaponType),
    });

    fetchWeaponTypes();

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
  }

  const deleteWeaponType = async(weaponType: string) => {
    try {
    const ref = doc(db, "weaponTypes", "NDQHiTORHZRqinvmuwmN");

    await updateDoc(ref, {
      weaponTypeList: arrayRemove(weaponType),
    });

    fetchWeaponTypes();

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
  };

  return (
    <WeaponTypesContext.Provider value={{ weaponTypes, addWeaponType, deleteWeaponType }}>
      {children}
    </WeaponTypesContext.Provider>
  );
}

export function useWeaponTypes() {
  const context = useContext(WeaponTypesContext);
  if (context === undefined) {
    throw new Error('useWeaponTypes must be used within WeaponTypesProvider');
  }
  return context;
}
