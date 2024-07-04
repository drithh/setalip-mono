'use client';

import {
  SelectAllClassWithAsset,
  SelectClassType,
} from '@repo/shared/repository';
import Class from './class';
import { useEffect, useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { cn } from '@repo/ui/lib/utils';

interface ClassProps {
  classes: SelectAllClassWithAsset['data'];
  classTypes: SelectClassType[];
}

export default function ListClass({ classes, classTypes }: ClassProps) {
  const [filteredClasses, setFilteredClasses] =
    useState<SelectAllClassWithAsset['data']>(classes);
  const [selectedClassType, setSelectedClassType] = useState<SelectClassType>({
    id: 0,
    type: 'All',
  });

  const classesTypeWithAll: SelectClassType[] = [
    { id: 0, type: 'All' },
    ...classTypes,
  ];

  const onFilter = (classType: SelectClassType) => {
    setSelectedClassType(classType);
    console.log(classType);
    if (classType.id === 0) {
      setFilteredClasses(classes);
      return;
    } else {
      setFilteredClasses(
        classes.filter((singleClass) => {
          return singleClass.class_type_id === classType.id;
        }),
      );
    }
  };

  const isActive = (classType: SelectClassType) => {
    return selectedClassType?.id === classType.id;
  };

  return (
    <div className="mt-8 flex flex-col gap-4 ">
      <div className="grid grid-cols-2 gap-4 rounded-lg  bg-primary/30 p-2 sm:max-w-fit sm:grid-cols-4">
        {classesTypeWithAll.map((classType) => (
          <Button
            variant={'ghost'}
            key={classType.id}
            className={cn(
              'rounded-lg px-4 py-2 capitalize hover:bg-primary/70 hover:text-primary-foreground/70 ',
              isActive(classType) &&
                'bg-primary hover:bg-primary/90 hover:text-primary-foreground',
            )}
            onClick={() => onFilter(classType)}
          >
            <p>{classType.type} Class</p>
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((singleClass) => (
          <Class key={singleClass.id} singleClass={singleClass} />
        ))}
      </div>
    </div>
  );
}
