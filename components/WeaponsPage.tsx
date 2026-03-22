'use client';

import { useState } from 'react';
import { Weapon } from '@/contexts/WeaponsContext';
import { StatisticsCards } from './StatisticsCards';
import { WeaponsTable } from './WeaponsTable';
import { WeaponDetailModal } from './WeaponDetailModal';
import { WeaponFormModal } from './WeaponFormModal';
import { useWeapons } from '@/contexts/WeaponsContext';

export function WeaponsPage() {
  const { addWeapon, updateWeapon, deleteWeapon } = useWeapons();
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingWeapon, setEditingWeapon] = useState<Weapon | null>(null);

  const handleViewDetails = (weapon: Weapon) => {
    setSelectedWeapon(weapon);
    setIsDetailModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingWeapon(null);
    setIsFormModalOpen(true);
  };

  const handleEditWeapon = (weapon: Weapon) => {
    setEditingWeapon(weapon);
    setIsFormModalOpen(true);
  };

  const handleSaveWeapon = (weaponData: Omit<Weapon, 'id'>) => {
    if (editingWeapon && editingWeapon.id) {
      updateWeapon(editingWeapon.id, weaponData);
    } else {
      addWeapon(weaponData);
    }
    setIsFormModalOpen(false);
    setEditingWeapon(null);
  };

  const handleDeleteWeapon = (id: string) => {
    deleteWeapon(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Weapons Charge to All Collection</h1>
        <p className="text-gray-600 mt-2">Manage and track all weapons in the collection</p>
      </div>

      <StatisticsCards />

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <WeaponsTable onViewDetails={handleViewDetails} onAddNew={handleAddNew} />
      </div>

      {selectedWeapon && (
        <WeaponDetailModal
          weapon={selectedWeapon}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={handleEditWeapon}
          onDelete={handleDeleteWeapon}
        />
      )}

      <WeaponFormModal
        weapon={editingWeapon}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingWeapon(null);
        }}
        onSave={handleSaveWeapon}
      />
    </div>
  );
}
