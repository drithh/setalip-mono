'use client';
import { SelectPackages } from '@repo/shared/repository';
import { moneyFormatter } from '@repo/shared/util';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { compareAsc, format } from 'date-fns';
import Link from 'next/link';
import PulsatingButton from '@repo/ui/components/pulsating-button';
interface Package {
  singlePackage: SelectPackages;
}

export default function Package({ singlePackage }: Package) {
  const isDiscount =
    singlePackage.discount_end_date &&
    compareAsc(singlePackage.discount_end_date, new Date()) === 1;

  const price = isDiscount
    ? singlePackage.price *
      (100 - (singlePackage.discount_percentage ?? 0)) *
      0.01
    : singlePackage.price;

  return (
    <Card
      className={`relative flex flex-col overflow-hidden rounded-xl border pt-10 ${
        isDiscount
          ? ' border-2 border-red-400 bg-gradient-to-r from-red-50 to-red-100'
          : ''
      }`}
    >
      {isDiscount && (
        <div className="absolute right-0 top-0 rounded-bl-xl rounded-tr-xl border border-red-700 bg-gradient-to-r from-red-600 to-red-400 px-4 py-1 font-semibold text-white shadow-lg">
          <p>{singlePackage.discount_percentage}% off</p>
        </div>
      )}
      <div className="mb-10 flex h-40 flex-col place-content-between px-4">
        <div className="flex flex-col">
          <h1 className="text-center text-xl font-semibold uppercase text-secondary-foreground">
            {singlePackage.name}
          </h1>
          <p className="text-center text-lg font-semibold capitalize text-gray-500">
            {singlePackage.class_type} class
          </p>
        </div>
        {isDiscount ? (
          <div className="flex flex-col place-content-end place-items-center">
            <p className="text-gray-500 line-through">
              {moneyFormatter.format(singlePackage.price)}
            </p>
            <p className="text-2xl font-semibold">
              {moneyFormatter.format(price)}
            </p>
            <p>
              {moneyFormatter.format(price / singlePackage.credit)} / Session
            </p>
          </div>
        ) : (
          <div className="flex flex-col place-content-end place-items-center">
            <p className="text-2xl font-semibold">
              {moneyFormatter.format(price)}
            </p>
            <p>
              {moneyFormatter.format(price / singlePackage.credit)} / Session
            </p>
          </div>
        )}
      </div>
      <div className="h-16 px-4 py-2">
        <Link
          href={`/packages/${singlePackage.id}`}
          passHref
          className="w-full"
        >
          {isDiscount ? (
            <PulsatingButton className="w-full">Buy now</PulsatingButton>
          ) : (
            <Button variant={'outline'} className="w-full">
              Buy now
            </Button>
          )}
        </Link>
      </div>
      <div className="flex flex-grow flex-col bg-primary pb-8 pt-4 ">
        <p className="text-center ">
          Total credit worth: {singlePackage.credit} credits
        </p>
        <p className="text-center ">
          Valid for: {singlePackage.valid_for} days
        </p>
        <p className="text-center ">
          Loyalty points: {singlePackage.loyalty_points} points
        </p>
        {singlePackage.one_time_only ? (
          <p className="text-center ">One time purchase only</p>
        ) : (
          <p className="text-center ">Recurring purchase allowed</p>
        )}
        {isDiscount && (
          <p className="f text-center">
            Discount ends on:{' '}
            {format(
              singlePackage.discount_end_date ?? new Date(),
              'dd MMM yyyy HH:mm',
            )}
          </p>
        )}
      </div>
    </Card>
  );
}
