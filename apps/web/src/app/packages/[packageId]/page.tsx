import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { container, TYPES } from '@repo/shared/inversify';
import {
  ClassTypeService,
  PackageService,
  WebSettingService,
} from '@repo/shared/service';
import {  moneyFormatter } from '@repo/shared/util';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/ui/components/ui/alert';
import { Badge } from '@repo/ui/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';


import { Separator } from '@repo/ui/components/ui/separator';
import {
  Calendar,
  CheckCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth';

import CreateTransaction from './create-transaction.form';
import FindVoucher from './find-voucher.form';

export default async function PackageDetail({
  params,
}: {
  params: { packageId: string };
}) {
  const auth = await validateUser();

  const packageIdNumber = parseInt(params.packageId);
  if (isNaN(packageIdNumber)) {
    redirect('/packages');
  }
  const packageService = container.get<PackageService>(TYPES.PackageService);
  const singlePackage = await packageService.findById(packageIdNumber);

  if (!singlePackage.result) {
    redirect('/packages');
  }

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classType = await classTypeService.findById(
    singlePackage.result.class_type_id,
  );
  if (!classType.result) {
    redirect('/packages');
  }

  const uniqueCode = await packageService.findPackageTransactionUniqueCode(
    auth.user.id,
    singlePackage.result.id,
  );

  if (uniqueCode.error) {
    redirect('/packages');
  }

  const totalPrice =
    singlePackage.result.price + uniqueCode.result?.unique_code;

  const WebSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );
  const depositAccounts = await WebSettingService.findAllDepositAccount({
    perPage: 100,
  });

  return (
    <div>
      <div className="w-full">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid  gap-6 px-4 md:px-6  lg:grid-cols-[5fr_3fr] lg:gap-12">
            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {singlePackage.result.name}
                </h1>
                <Badge
                  className="w-fit text-center capitalize"
                  color="secondary"
                  variant="default"
                >
                  {classType.result.type} Class
                </Badge>
              </div>
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Detail Package
              </h1>
              <div className="flex flex-row place-items-center gap-4 pl-4">
                <CheckCircle size={24} className="text-muted-foreground" />
                <p className="text-lg capitalize text-muted-foreground">
                  {singlePackage.result.credit} Class session for{' '}
                  {classType.result.type} class
                </p>
              </div>
              <div className="flex flex-row place-items-center gap-4 pl-4">
                <Sparkles size={24} className="text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  {singlePackage.result.loyalty_points} Loyalty Points
                </p>
              </div>
              <div className="flex flex-row place-items-center gap-4 pl-4">
                <Calendar size={24} className="text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Valid for {singlePackage.result.valid_for} days
                </p>
              </div>
              <div className="flex flex-row place-items-center gap-4 pl-4">
                <MapPin size={24} className="text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Can be used at any location
                </p>
              </div>
              {uniqueCode.result?.is_new === false && (
                <Alert>
                  <AlertTitle className="flex gap-2">
                    <ExclamationTriangleIcon />
                    Warning
                  </AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    You already have a transaction with this package, this
                    current transaction will be added to the existing
                    transaction, and the expiry date will be extended if you
                    update the transaction.
                    {/* <Link href="/me/package">
                      <Button className="w-full">Open My Transaction</Button>
                    </Link> */}
                  </AlertDescription>
                </Alert>
              )}

              <CreateTransaction
                packageId={singlePackage.result.id}
                id={uniqueCode.result.id}
                depositAccounts={depositAccounts.result?.data ?? []}
                price={totalPrice}
                uniqueCode={uniqueCode.result.unique_code}
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
                        {moneyFormatter.format(singlePackage.result.price)}
                      </p>
                    </div>
                    <div className="flex place-content-between gap-3">
                      <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                        Discount
                      </p>
                      <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                        {moneyFormatter.format(0)}
                      </p>
                    </div>
                    <div className="flex place-content-between gap-3">
                      <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                        Voucher Discount
                      </p>
                      <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                        {moneyFormatter.format(0)}
                      </p>
                    </div>
                    <div className="flex place-content-between gap-3">
                      <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                        Unique Code
                      </p>
                      <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                        {moneyFormatter.format(
                          uniqueCode.result?.unique_code ?? 0,
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
              <FindVoucher />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
