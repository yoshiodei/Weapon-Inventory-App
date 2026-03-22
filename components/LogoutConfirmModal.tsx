'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { addHistory } from '@/lib/history/addHistory';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ isOpen, onClose, onConfirm }: LogoutConfirmModalProps) {
  
  const {userData} = useAuth(); 
  
  const handleConfirm = () => {
    onConfirm();

    addHistory(
      'Logout',
      userData?.email || 'Unknown User',
      `User logged out of the system.`,
      'logout'
    )

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white border-gray-200" aria-describedby="logout-description">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Confirm Logout</DialogTitle>
          <DialogDescription id="logout-description">
            Are you sure you want to logout from the Weapons Management System?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end pt-4">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-900 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
