'use client';

import {
  SelectClassType,
  SelectCoachWithUser,
  SelectLocationWithAsset,
} from '@repo/shared/repository';
import { MultiSelect } from '@repo/ui/components/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { useState } from 'react';
interface ToolbarProps {
  locations: SelectLocationWithAsset[];
  classTypes: SelectClassType[];
  coaches: SelectCoachWithUser[];
}

type Option = Record<'value' | 'label', string>;

export default function Toolbar({
  locations,
  classTypes,
  coaches,
}: ToolbarProps) {
  const [selectedLocation, setSelectedLocation] = useState<Option>();
  const [selectedClassTypes, setSelectedClassTypes] = useState<Option[]>([]);
  const [selectedCoaches, setSelectedCoaches] = useState<Option[]>([]);

  const locationOnChange = (id: string) => {
    const location = locations.find(
      (location) => location.id.toString() === id,
    );
    if (!location) return;

    setSelectedLocation({
      value: location.id.toString(),
      label: location.name,
    });
  };

  return (
    <div className="flex gap-8">
      <div className="w-64">
        <Select
          onValueChange={locationOnChange}
          defaultValue={selectedLocation?.value}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kelas" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-64">
        <MultiSelect
          selected={selectedClassTypes}
          setSelected={setSelectedClassTypes}
          options={classTypes.map((classType) => ({
            value: classType.id.toString(),
            label: classType.type,
          }))}
        />
      </div>
      <div className="w-64">
        <MultiSelect
          selected={selectedCoaches}
          setSelected={setSelectedCoaches}
          options={coaches.map((coach) => ({
            value: coach.id.toString(),
            label: coach.name,
          }))}
        />
      </div>
    </div>
  );
}
