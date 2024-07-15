import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { container, TYPES } from '@repo/shared/inversify';
import {
  ClassTypeService,
  PackageService,
  WebSettingService,
} from '@repo/shared/service';
import { moneyFormatter } from '@repo/shared/util';

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
import { Calendar, CheckCircle, MapPin, Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth';

import CreateTransaction from './create-transaction.form';
import FindVoucher from './find-voucher.form';
import { useState } from 'react';
import { SelectVoucher } from '@repo/shared/repository';
import Client from './client';

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

  const packageTransaction =
    await packageService.findPackageTransactionByUserIdAndPackageId(
      auth.user.id,
      singlePackage.result.id,
    );

  if (packageTransaction.error) {
    redirect('/packages');
  }

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
          <Client
            singlePackage={singlePackage.result}
            classType={classType.result}
            packageTransaction={packageTransaction.result}
            depositAccounts={depositAccounts.result}
          />
        </section>
      </div>
    </div>
  );
}
