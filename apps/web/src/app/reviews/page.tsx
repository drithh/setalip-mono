import { validateUser } from '@/lib/auth';
import { container, TYPES } from '@repo/shared/inversify';
import { PackageService, WebSettingService } from '@repo/shared/service';
import RichTextViewer from '@repo/ui/components/rich-text/viewer';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components/ui/select';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { StarIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
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
