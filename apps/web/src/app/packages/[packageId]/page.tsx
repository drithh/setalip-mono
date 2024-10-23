import { container, TYPES } from '@repo/shared/inversify';
import {
  ClassTypeService,
  PackageService,
  WebSettingService,
} from '@repo/shared/service';






import { redirect } from 'next/navigation';

import { validateUser } from '@/lib/auth';

import Client from './client';

export default async function PackageDetail(
  props: {
    params: Promise<{ packageId: string }>;
  }
) {
  const params = await props.params;
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
