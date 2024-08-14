'use client';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
  SelectPackage,
  SelectClassType,
  SelectAllDepositAccount,
  SelectPackageTransactionByUser,
  SelectVoucher,
} from '@repo/shared/repository';
import { moneyFormatter } from '@repo/shared/util';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@repo/ui/components/ui/alert';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';
import {
  CheckCircle,
  Sparkles,
  Calendar,
  MapPin,
  RefreshCcw,
} from 'lucide-react';
import CreateTransaction from './create-transaction.form';
import FindVoucher from './find-voucher.form';
import { Badge } from '@repo/ui/components/ui/badge';
import { useState } from 'react';
import { BackButton } from '@repo/ui/components/back-button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@repo/ui/components/ui/breadcrumb';

interface ClientProps {
  singlePackage: SelectPackage;
  classType: SelectClassType;
  packageTransaction: SelectPackageTransactionByUser;
  depositAccounts: SelectAllDepositAccount | undefined;
}

export default function Client({
  singlePackage,
  classType,
  packageTransaction,
  depositAccounts,
}: ClientProps) {
  const [voucher, setVoucher] = useState<SelectVoucher>();
  const isDiscount =
    singlePackage.discount_end_date &&
    singlePackage.discount_end_date > new Date();
  const discount = isDiscount
    ? (singlePackage.price * (singlePackage.discount_percentage ?? 100)) / 100
    : 0;

  const voucherDiscount = voucher
    ? voucher.type === 'percentage'
      ? ((singlePackage.price - discount) * voucher.discount) / 100
      : voucher.discount
    : (packageTransaction?.voucher_discount ?? 0);

  const totalPrice =
    singlePackage.price +
    packageTransaction?.unique_code -
    voucherDiscount -
    discount;

  return (
    <div className="container flex flex-col gap-4">
      <div className=" my-2 flex place-items-center gap-2">
        <BackButton />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/packages" className="text-[1.05rem]">
                Packages
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[1.05rem]">
                {singlePackage.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="container grid  gap-6 px-4 md:px-6  lg:grid-cols-[5fr_3fr] lg:gap-12">
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {singlePackage.name}
            </h1>
            <Badge
              className="w-fit text-center capitalize"
              color="secondary"
              variant="default"
            >
              {classType.type} Class
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Detail Package
          </h1>
          <div className="flex flex-row place-items-center gap-4 pl-4">
            <CheckCircle size={24} className="text-muted-foreground" />
            <p className="text-lg capitalize text-muted-foreground">
              {singlePackage.credit} Class session for {classType.type} class
            </p>
          </div>
          <div className="flex flex-row place-items-center gap-4 pl-4">
            <Sparkles size={24} className="text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              {singlePackage.loyalty_points} Loyalty Points
            </p>
          </div>
          <div className="flex flex-row place-items-center gap-4 pl-4">
            <Calendar size={24} className="text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Valid for {singlePackage.valid_for} days
            </p>
          </div>
          <div className="flex flex-row place-items-center gap-4 pl-4">
            <MapPin size={24} className="text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Can be used at any location
            </p>
          </div>
          <div className="flex flex-row place-items-center gap-4 pl-4">
            <RefreshCcw size={24} className="text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              {singlePackage.one_time_only
                ? 'Can only be bought once'
                : 'Can be bought multiple times'}
            </p>
          </div>
          {packageTransaction?.is_new === false && (
            <Alert>
              <AlertTitle className="flex gap-2">
                <ExclamationTriangleIcon />
                Warning
              </AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                You already have a transaction with this package, this current
                transaction will be added to the existing transaction, and the
                expiry date will be extended if you update the transaction.
                {/* <Link href="/me/package">
              <Button className="w-full">Open My Transaction</Button>
            </Link> */}
              </AlertDescription>
            </Alert>
          )}

          <CreateTransaction
            packageId={singlePackage.id}
            depositAccounts={depositAccounts?.data ?? []}
            price={totalPrice}
            packageTransaction={packageTransaction}
            voucherCode={voucher?.code ?? ''}
          />
        </div>
        <div className="row-span-2 flex flex-col">
          <Card className="row-span-2 mt-6 flex  flex-col gap-2 space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Detail Price
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex place-content-between gap-3">
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    Standard
                  </p>
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    {moneyFormatter.format(singlePackage.price)}
                  </p>
                </div>
                <div className="flex place-content-between gap-3">
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    Discount
                  </p>
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    {moneyFormatter.format(discount)}
                  </p>
                </div>
                <div className="flex place-content-between gap-3">
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    Voucher Discount
                  </p>
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    {moneyFormatter.format(voucherDiscount)}
                  </p>
                </div>
                <div className="flex place-content-between gap-3">
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    Unique Code
                  </p>
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    {moneyFormatter.format(
                      packageTransaction?.unique_code ?? 0,
                    )}
                  </p>
                </div>
                <Separator className="my-2" />
                <div className="flex place-content-between gap-3 font-semibold">
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    Total
                  </p>
                  <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                    {moneyFormatter.format(totalPrice)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* voucher code use */}
          <FindVoucher setVoucher={setVoucher} />
        </div>
      </div>
    </div>
  );
}
