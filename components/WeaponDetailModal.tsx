'use client';

import { Weapon } from '@/contexts/WeaponsContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface WeaponDetailModalProps {
  weapon: Weapon | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (weapon: Weapon) => void;
  onDelete: (id: string) => void;
}

export function WeaponDetailModal({
  weapon,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: WeaponDetailModalProps) {
  if (!weapon) return null;

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this weapon?')) {
      onDelete(weapon.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200" aria-describedby="weapon-detail-description">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{weapon.name}</DialogTitle>
          <DialogDescription id="weapon-detail-description">
            Detailed information about the selected weapon
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3 text-sm">
            <div>
              <label className="font-semibold text-gray-900">Weapon Name</label>
              <p className="text-gray-700">{weapon.name}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-900">Type</label>
              <p className="text-gray-700">{weapon.type}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-900">Collection</label>
              <p className="text-gray-700">{weapon.collection}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-900">Serial Number</label>
              <p className="text-gray-700">{weapon.serialNumber}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-gray-900 hover:bg-gray-100"
              onClick={() => {
                onEdit(weapon);
                onClose();
              }}
            >
              Edit
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" className="flex-1 bg-gray-200 text-gray-900 hover:bg-gray-300" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
