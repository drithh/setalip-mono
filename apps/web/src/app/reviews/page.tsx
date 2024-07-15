import { container, TYPES } from '@repo/shared/inversify';
import { PackageService } from '@repo/shared/service';




import { redirect } from 'next/navigation';
import { toast } from 'sonner';

import { validateUser } from '@/lib/auth';

import CreateReviewForm from './create-review.form';

export default async function Page() {
  const { user } = await validateUser();

  const packageService = container.get<PackageService>(TYPES.PackageService);

  const singlePackage = await packageService.findAllPackageTransactionByUserId({
    perPage: 1,
    user_id: user.id,
  });

  if (!singlePackage.result?.data) {
    toast.error('You need to purchase a package to write a review');
    redirect('/packages');
  }
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <CreateReviewForm />
    </div>
  );
}
