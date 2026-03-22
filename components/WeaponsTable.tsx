'use client';

import { useState, useMemo } from 'react';
import { Weapon, useWeapons } from '@/contexts/WeaponsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCollections } from '@/contexts/CollectionsContext';
import { useWeaponTypes } from '@/contexts/WeaponTypeContext';

interface WeaponsTableProps {
  onViewDetails: (weapon: Weapon) => void;
  onAddNew: () => void;
}

const ITEMS_PER_PAGE = 10;

export function WeaponsTable({ onViewDetails, onAddNew }: WeaponsTableProps) {
  const { weapons } = useWeapons();
  const { collections } = useCollections();
  const { weaponTypes } = useWeaponTypes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);


  console.log('collections and type', collections, weaponTypes);
  
  // const weaponTypes = ['Rifle', 'Pistol', 'Shotgun', 'Sniper Rifle', 'Machine Gun', 'Other'];
  // const collections = ['North', 'South', 'East', 'West', 'Central'];

  const filteredWeapons = useMemo(() => {
    let filtered = weapons;
    console.log('weapons before filter', filtered);
    // Filter by search term (name and serial number only)
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((weapon) =>
        weapon.name.toLowerCase().includes(lowerSearch) ||
        weapon.serialNumber.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((weapon) => weapon.type === selectedType);
    }

    // Filter by collection
    if (selectedCollection !== 'all') {
      filtered = filtered.filter((weapon) => weapon.collection === selectedCollection);
    }

    return filtered;
  }, [weapons, searchTerm, selectedType, selectedCollection]);

  const totalPages = Math.ceil(filteredWeapons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWeapons = filteredWeapons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h3 className="text-xl font-bold text-gray-900">Weapons Inventory</h3>
        <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto">
          + Add New Weapon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name or serial number..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 py-2 border-gray-300 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white hover:border-gray-400"
          >
            <option value="all">All Types</option>
            {weaponTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={selectedCollection}
            onChange={(e) => {
              setSelectedCollection(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white hover:border-gray-400"
          >
            <option value="all">All Collections</option>
            {collections.map((collection) => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow>
              <TableHead className="text-gray-900 font-semibold">Weapon</TableHead>
              <TableHead className="text-gray-900 font-semibold">Type</TableHead>
              <TableHead className="text-gray-900 font-semibold">Collection</TableHead>
              <TableHead className="text-gray-900 font-semibold">Serial Number</TableHead>
              <TableHead className="text-gray-900 font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWeapons.length > 0 ? (
              paginatedWeapons.map((weapon) => (
                <TableRow key={weapon.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <TableCell className="text-gray-800 font-medium">{weapon.name}</TableCell>
                  <TableCell className="text-gray-700">{weapon.type}</TableCell>
                  <TableCell className="text-gray-700">{weapon.collection}</TableCell>
                  <TableCell className="text-gray-600 font-mono text-sm">{weapon.serialNumber}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(weapon)}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                  No weapons found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{paginatedWeapons.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-semibold">{Math.min(startIndex + ITEMS_PER_PAGE, filteredWeapons.length)}</span> of{' '}
          <span className="font-semibold">{filteredWeapons.length}</span> weapons
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-700 font-medium px-4 py-2 bg-gray-100 rounded">
            Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages || 1}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="border-gray-300 text-gray-900 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
