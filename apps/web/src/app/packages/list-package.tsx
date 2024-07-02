'use client';

import Package from './package';
import { useEffect, useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { cn } from '@repo/ui/lib/utils';
import { SelectAllPackage, SelectClassType } from '@repo/shared/repository';

interface PackageProps {
  packages: SelectAllPackage['data'];
  classTypes: SelectClassType[];
}

export default function ListPackage({ packages, classTypes }: PackageProps) {
  const [filteredPackages, setFilteredPackages] =
    useState<SelectAllPackage['data']>(packages);
  const [selectedPackageType, setSelectedPackageType] =
    useState<SelectClassType>();

  const packagesTypeWithAll: SelectClassType[] = [
    { id: 0, type: 'All' },
    ...classTypes,
  ];

  const onFilter = (packageType: SelectClassType) => {
    setSelectedPackageType(packageType);
    console.log(packageType);
    if (packageType.id === 0) {
      setFilteredPackages(packages);
      return;
    } else {
      setFilteredPackages(
        packages.filter((singlePackage) => {
          return singlePackage.class_type_id === packageType.id;
        }),
      );
    }
  };

  const isActive = (packageType: SelectClassType) => {
    return selectedPackageType?.id === packageType.id;
  };

  return (
    <div className="mt-8 flex flex-col gap-4 ">
      <div className="grid grid-cols-2 gap-4 rounded-lg  bg-primary/30 p-2 sm:max-w-fit sm:grid-cols-4">
        {packagesTypeWithAll.map((packageType) => (
          <Button
            variant={'ghost'}
            key={packageType.id}
            className={cn(
              'rounded-lg px-4 py-2 capitalize hover:bg-primary/70 hover:text-primary-foreground/70 ',
              isActive(packageType) &&
                'bg-primary hover:bg-primary/90 hover:text-primary-foreground',
            )}
            onClick={() => onFilter(packageType)}
          >
            <p>{packageType.type} Class</p>
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((singlePackage) => (
          <Package key={singlePackage.id} singlePackage={singlePackage} />
        ))}
      </div>
    </div>
  );
}
