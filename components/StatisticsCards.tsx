'use client';

import { useWeapons } from '@/contexts/WeaponsContext';
import { Card, CardContent } from '@/components/ui/card';
import {  Layers, MapPin, Crosshair, Swords } from 'lucide-react';

export function StatisticsCards() {
  const { weapons } = useWeapons();

  const stats = {
    totalWeapons: weapons.length,
    totalTypes: new Set(weapons.map((w) => w.type)).size,
    totalCollections: new Set(weapons.map((w) => w.collection)).size,
    riflesTotalRifles: weapons.filter((w) => w.type.toLowerCase().includes('rifle')).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
        <CardContent>
          <div className="text-center flex py-0">
            <div className="flex justify-center">
              <Swords className="w-15 h-15 text-blue-600" />
            </div>
            <div className="flex flex-col ml-5">
              <div className="text-3xl font-bold text-blue-700 text-left">{stats.totalWeapons}</div>
              <p className="text-blue-600 text-sm font-medium">Total Weapons</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
        <CardContent>
          <div className="text-center flex py-0">
            <div className="flex justify-center">
              <Layers className="w-15 h-15 text-green-600" />
            </div>
            <div className="flex flex-col ml-5">
              <div className="text-3xl font-bold text-green-700 text-left">{stats.totalTypes}</div>
              <p className="text-green-600 text-sm font-medium">Weapon Types</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-shadow">
        <CardContent>
          <div className="text-center flex py-0">
            <div className="flex justify-center">
              <MapPin className="w-15 h-15 text-amber-600" />
            </div>
            <div className="flex flex-col ml-5">
              <div className="text-3xl font-bold text-amber-700 text-left">{stats.totalCollections}</div>
              <p className="text-amber-600 text-sm font-medium">Collections Covered</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
        <CardContent>
          <div className="text-center flex py-0">
            <div className="flex justify-center">
              <Crosshair className="w-15 h-15 text-purple-600" />
            </div>
            <div className="flex flex-col ml-5">
              <div className="text-3xl font-bold text-purple-700 text-left">{stats.riflesTotalRifles}</div>
              <p className="text-purple-600 text-sm font-medium">Rifles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
