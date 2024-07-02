'use client';
import { SelectPackages } from '@repo/shared/repository';
import { moneyFormatter } from '@repo/shared/util';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';

interface Package {
  singlePackage: SelectPackages;
}

export default function Package({ singlePackage }: Package) {
  return (
    <Card className="flex flex-col rounded-xl border pt-8">
      <div className="mb-12 flex h-40 flex-col place-content-between px-4">
        <div className="flex flex-col">
          <h1 className="text-center text-xl font-semibold uppercase text-secondary-foreground">
            {singlePackage.name}
          </h1>
          <p className="text-center text-lg font-semibold capitalize text-gray-500">
            {singlePackage.class_type} class
          </p>
        </div>
        <div className="flex flex-col place-content-end place-items-center ">
          <p className="text-2xl font-semibold">
            {moneyFormatter.format(singlePackage.price)}
          </p>
          <p>
            {moneyFormatter.format(singlePackage.price / singlePackage.credit)}{' '}
            / Session
          </p>
        </div>
      </div>
      <div className="px-4 py-2">
        <Button
          variant={'outline'}
          className="w-full"
          onClick={() => {
            console.log('clicked');
          }}
        >
          Buy now
        </Button>
      </div>
      <div className="flex flex-col bg-primary pb-8 pt-4">
        <p className="text-center font-semibold">
          Total credit worth: {singlePackage.credit} credits
        </p>
        <p className="text-center font-semibold">
          Valid for: {singlePackage.valid_for} days
        </p>
        <p className="text-center font-semibold">
          Loyalty points: {singlePackage.loyalty_points} points
        </p>
        {singlePackage.one_time_only ? (
          <p className="text-center font-semibold">One time purchase only</p>
        ) : (
          <p className="text-center font-semibold">
            Recurring purchase allowed
          </p>
        )}
      </div>
    </Card>
  );
}
