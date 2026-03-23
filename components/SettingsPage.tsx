'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Lock, User, Database, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useWeaponTypes } from '@/contexts/WeaponTypeContext';
import { useCollections } from '@/contexts/CollectionsContext';
import { changeUserPassword } from '@/lib/auth/changePassword';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/contexts/ShowToast';
import { addHistory } from '@/lib/history/addHistory';

export function SettingsPage() {
 
  const { userData } = useAuth();

  const { weaponTypes, addWeaponType, deleteWeaponType } = useWeaponTypes();
  const { collections, addCollection, deleteCollection } = useCollections();
  
  const [loading, setLoading] = useState(false);
  const [newType, setNewType] = useState('');
  const [newCollection, setNewCollection] = useState('');
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    setLoading(true);
    if (!formData.oldPassword || !formData.newPassword) {
      setLoading(false);
      setFormData({ oldPassword: '', newPassword: '' });
      showToast('Please fill in both old and new password fields', 'error');
      return;
    }
    if (userData?.email) {    
      await changeUserPassword(userData.email, formData.oldPassword, formData.newPassword);

      addHistory(
        'Edit',
        userData?.email || 'Unknown User',
        `User ${userData?.email} updated password`,
        'edit'
      );

      setFormData({ oldPassword: '', newPassword: '' });
      setLoading(false);
    }
  };

  const handleAddWeaponType = () => {
    if(newType.trim() === '') {
      showToast('Weapon type cannot be empty', 'error');
      return;
    }
    if (newType.trim() && !weaponTypes.includes(newType)) {
      addWeaponType(newType);

      addHistory(
        'Create',
        userData?.email || 'Unknown User',
        `Added new weapon type: ${newType}`,
        'create'
      );

      setNewType('');
    }
  };

  const handleRemoveWeaponType = (type: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the weapon type "${type}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    deleteWeaponType(type);

    addHistory(
        'Delete',
        userData?.email || 'Unknown User',
        `Deleted weapon type: ${type}`,
        'delete'
      );
  };

  const handleAddCollection = () => {
    if (newCollection.trim() === '') {
      showToast('Collection name cannot be empty', 'error');
      return;
    }
    if (newCollection.trim() && !collections.includes(newCollection)) {
      addCollection(newCollection);

      addHistory(
        'Create',
        userData?.email || 'Unknown User',
        `Added new collection: ${newCollection}`,
        'create'
      );

      setNewCollection('');
    }
  };

  const handleRemoveCollection = (collection: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the collection "${collection}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    deleteCollection(collection);

    addHistory(
        'Delete',
        userData?.email || 'Unknown User',
        `Deleted collection: ${collection}`,
        'delete'
      );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and system preferences</p>
      </div>

      {/* Account Settings */}
      {/* <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-gray-900">Account Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Email Address</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border-gray-300 text-gray-900"
              disabled
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Username</label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card> */}

      {/* Security Settings */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-gray-900">Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <h4 className="font-medium text-gray-900 mb-2">Change Password</h4>
          <p className="text-sm text-gray-600 mb-4">
            Update your password to keep your account secure
          </p>
          <div>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-gray-900">Email Address</label>
            <Input
              name="email"
              type="email"
              readOnly
              value={userData?.email || ""}
              className="bg-gray-50 border-gray-300 text-gray-900"
              disabled
            />
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-gray-900">Old Password</label>
            <Input
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-gray-900">New Password</label>
            <Input
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
            
            <Button
              onClick={handleChangePassword}
              variant="outline"
              className="border-gray-300 bg-gray-200 text-gray-900 hover:bg-gray-300 hover:text-gray-800"
            >
              {loading ? "...Loading" : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weapon Types Management */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-gray-900">Weapon Types</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Add New Weapon Type</label>
            <div className="flex gap-2">
              <Input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Enter new weapon type"
                className="bg-gray-50 border-gray-300 text-gray-900"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddWeaponType();
                }}
              />
              <Button
                onClick={handleAddWeaponType}
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              >
                Add
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Existing Types</h4>
            <div className="flex flex-wrap gap-2">
              {weaponTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-900"
                >
                  <span>{type}</span>
                  <button
                    onClick={() => handleRemoveWeaponType(type)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collections Management */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-gray-900">Collections</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Add New Collection</label>
            <div className="flex gap-2">
              <Input
                value={newCollection}
                onChange={(e) => setNewCollection(e.target.value)}
                placeholder="Enter new collection"
                className="bg-gray-50 border-gray-300 text-gray-900"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCollection();
                }}
              />
              <Button
                onClick={handleAddCollection}
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              >
                Add
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Existing Collections</h4>
            <div className="flex flex-wrap gap-2">
              {collections.map((collection) => (
                <div
                  key={collection}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-900"
                >
                  <span>{collection}</span>
                  <button
                    onClick={() => handleRemoveCollection(collection)}
                    className="hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Information */}
      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-gray-900">System Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">System Version</span>
            <span className="font-medium text-gray-900">1.0.1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Database Status</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
