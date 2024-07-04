import { container, TYPES } from '@repo/shared/inversify';
import {
  ClassService,
  PackageService,
  ClassTypeService,
} from '@repo/shared/service';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Carousel,
  CarouselMainContainer,
  SliderMainItem,
  CarouselThumbsContainer,
  CarouselIndicator,
} from '@repo/ui/components/ui/carousel';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { AspectRatio } from '@repo/ui/components/ui/aspect-ratio';
import Link from 'next/link';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';
import {
  MapPin,
  Mail,
  Phone,
  User2,
  CalendarClock,
  Clock,
  CreditCard,
  CheckCircle,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { addMinutes, format } from 'date-fns';
import { validateUser } from '@/lib/auth';
import { dateFormatter } from '@repo/shared/util';
import { moneyFormatter } from '@repo/shared/util';
import { Input } from '@repo/ui/components/ui/input';

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
                <Card className="mt-6 w-full">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                      Warning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex place-content-between gap-3">
                      <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                        You already have a transaction with this package,
                      </p>
                      <p className="text-base/relaxed text-muted-foreground md:text-lg/relaxed">
                        {uniqueCode.result.unique_code}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Button
                className="w-full"
                // onClick={() => {
                //   redirect(`/packages/${singlePackage.result.id}/buy`);
                // }}
              >
                Buy Now
              </Button>
              <Card
                key={singlePackage.result?.id}
                className="w-fit sm:col-span-1"
              >
                <CardHeader>
                  <CardTitle className="capitalize">
                    {/* {singlePackage.result?.package_name} */}
                  </CardTitle>
                  <CardDescription className="capitalize">
                    {/* {singlePackage.result?.class_type} */}
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <p>
                    {/* Sessions Remaining:{' '} */}
                    {/* {(singlePackage.result?.credit ?? 0) - */}
                    {/* (singlePackage.result?.credit_used ?? 0)} */}
                  </p>
                  <p>
                    {/* Expired At:{' '} */}
                    {/* {dateFormatter().format(singlePackage.result?.expired_at)} */}
                  </p>
                </CardContent>
              </Card>
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
                        {moneyFormatter.format(singlePackage.result.price)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* voucher code use */}
              <Card className="row-span-2 mt-6 flex  flex-col gap-2 space-y-4">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                    Voucher Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex place-content-between gap-3">
                    <Input
                      type="text"
                      placeholder="Enter Voucher Code"
                      className="w-full rounded-lg border p-2"
                    />
                    <Button className="w-1/4">Use</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
