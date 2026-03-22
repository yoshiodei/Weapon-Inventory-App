'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { showToast } from "./ShowToast";
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc,updateDoc } from "firebase/firestore";
import { addHistory } from '@/lib/history/addHistory';
import { useAuth } from '@/contexts/AuthContext';



export interface Weapon {
  id?: string;
  name: string;
  type: string;
  collection: string;
  serialNumber: string;
}


interface WeaponsContextType {
  weapons: Weapon[];
  addWeapon: (weapon: Weapon) => void;
  updateWeapon: (id: string, weapon: Weapon) => void;
  deleteWeapon: (id: string) => void;
}

const WeaponsContext = createContext<WeaponsContextType | undefined>(undefined);

export function WeaponsProvider({ children }: { children: React.ReactNode }) {

  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "weapons"));

        const data: Weapon[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Weapon, "id">),
        }));

        setWeapons(data);

        // cache in localStorage
        localStorage.setItem("weapons-cache", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching weapons:", error);

        // fallback to cache
        const cache = localStorage.getItem("weapons-cache");
        if (cache) {
          setWeapons(JSON.parse(cache));
        }
      }
    };

    fetchWeapons();
  }, []);

  const addWeapon = async(weapon: Weapon) => {
    try {

      const finalData = {
        name: weapon.name,
        type: weapon.type,
        collection: weapon.collection,
        serialNumber: weapon.serialNumber,
        createdAt: new Date(),
        editedAt: new Date()
      }
      
     const docRef = await addDoc(collection(db, "weapons"), finalData);
      
      setWeapons([...weapons, { ...finalData, id: docRef.id }]);
      showToast('Weapon added successfully!', 'success');

      addHistory(
        'Create',
        userData?.email || 'Unknown User', // replace with actual user info
        `Added weapon: ${weapon.name} (ID: ${docRef.id})`,
        'create'
      )
    } catch (error) {
      console.error("Error adding weapon:", error)
      showToast('Failed to add weapon. Please try again.', 'error');
    }
  }

  const updateWeapon = async(id: string, weapon: Weapon) => {
   try {    
     await updateDoc(doc(db, "weapons", id), { ...weapon });

     showToast('Weapon updated successfully!', 'success');
     setWeapons(weapons.map((w) => (w.id === id ? { ...weapon, id } : w)));

     addHistory(
      'Edit',
      userData?.email || 'Unknown User', // replace with actual user info
      `Edited weapon: ${weapon.name} (ID: ${id})`,
      'edit'
     )
   } catch (error) {
     console.error("Error updating weapon:", error);
     showToast('Failed to update weapon. Please try again.', 'error');
   }
  };

  const deleteWeapon = async(id: string) => {
    try{
      await deleteDoc(doc(db, "weapons", id));

      showToast('Weapon deleted successfully!', 'success');
      setWeapons(weapons.filter((w) => w.id !== id));

      addHistory(
      'Delete',
      userData?.email || 'Unknown User', // replace with actual user info
      `Deleted weapon with ID: ${id}`,
      'delete'
     )
    } catch (error) {
      console.error("Error deleting weapon:", error);
      showToast('Failed to delete weapon. Please try again.', 'error');
    }
  };

  return (
    <WeaponsContext.Provider value={{ weapons, addWeapon, updateWeapon, deleteWeapon }}>
      {children}
    </WeaponsContext.Provider>
  );
}

export function useWeapons() {
  const context = useContext(WeaponsContext);
  if (context === undefined) {
    throw new Error('useWeapons must be used within WeaponsProvider');
  }
  return context;
}
