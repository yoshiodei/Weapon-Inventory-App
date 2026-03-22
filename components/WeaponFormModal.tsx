'use client';

import { useState, useEffect } from 'react';
import { Weapon } from '@/contexts/WeaponsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCollections } from '@/contexts/CollectionsContext';
import { useWeaponTypes } from '@/contexts/WeaponTypeContext';

interface WeaponFormModalProps {
  weapon: Weapon | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (weapon: Weapon) => void;
}

export function WeaponFormModal({ weapon, isOpen, onClose, onSave }: WeaponFormModalProps) {
  const [formData, setFormData] = useState<Weapon>({
    id: '',
    name: '',
    type: '',
    collection: '',
    serialNumber: '',
    // image: '',
  });

  useEffect(() => {
    if (weapon) {
      setFormData(weapon);
    } else {
      setFormData({
        id: '',
        name: '',
        type: '',
        collection: '',
        serialNumber: '',
        // image: '',
      });
    }
  }, [weapon, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.type && formData.collection && formData.serialNumber) {
      onSave(formData);
      onClose();
    }
  };

  // const weaponTypes = ['Rifle', 'Pistol', 'Shotgun', 'Sniper Rifle', 'Machine Gun', 'Other'];
  // const collections = ['North', 'South', 'East', 'West', 'Central'];

  const { weaponTypes } = useWeaponTypes();
  const { collections } = useCollections();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200" aria-describedby="weapon-form-description">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{weapon ? 'Edit Weapon' : 'Add New Weapon'}</DialogTitle>
          <DialogDescription id="weapon-form-description">
            {weapon ? 'Update the weapon information below' : 'Fill in the details to add a new weapon'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Weapon Name</label>
            <Input
              name="name"
              placeholder="Enter weapon name"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900"
            >
              <option value="">Select Type</option>
              {weaponTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Collection</label>
            <select
              name="collection"
              value={formData.collection}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900"
            >
              <option value="">Select Collection</option>
              {collections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Serial Number</label>
            <Input
              name="serialNumber"
              placeholder="Enter serial number"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Save
            </Button>
            <Button type="button" variant="secondary" className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
