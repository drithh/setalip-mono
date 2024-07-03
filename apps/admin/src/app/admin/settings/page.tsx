import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import DeleteLocation from '../locations/[locationId]/delete-location.dialog';
import { Label } from '@repo/ui/components/ui/label';
import { Input } from '@repo/ui/components/ui/input';
import { container, TYPES } from '@repo/shared/inversify';
import { WebSettingService } from '@repo/shared/service';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import { Textarea } from '@repo/ui/components/ui/textarea';
import FaqTable from './_components/faq-table';
import { findAllDepositReviewFaqSchema } from '@repo/shared/api/schema';

interface IndexPageProps {
  searchParams: Record<string, any>;
}

export default async function Page({ searchParams }: IndexPageProps) {
  const search = findAllDepositReviewFaqSchema.parse(searchParams);

  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );
  const contact = await webSettingService.findContact();
  const logo = await webSettingService.findLogo();
  const termsAndConditions = await webSettingService.findTermsAndConditions();
  const privacyPolicy = await webSettingService.findPrivacyPolicy();

  return (
    <main className="mx-auto flex w-full max-w-screen-xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <div className="flex place-items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Instagram</Label>
                <Input
                  readOnly
                  type="text"
                  className="w-full"
                  defaultValue={contact.result?.instagram}
                />
              </div>

              <div className="row-span-2 flex flex-col gap-3">
                <Label htmlFor="address">Logo</Label>
                <div className="relative flex-grow rounded-md border p-2">
                  <ImageWithFallback
                    src={logo.result?.logo}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="address">Tiktok</Label>
                <Input
                  readOnly
                  className="w-full"
                  defaultValue={contact.result?.tiktok}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="address">Terms and Conditions</Label>
              <Textarea
                readOnly
                className="w-full"
                defaultValue={termsAndConditions.result}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phone">Privacy Policy</Label>
              <Textarea
                readOnly
                className="w-full"
                defaultValue={privacyPolicy.result}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review</CardTitle>
        </CardHeader>
        <CardContent>{/* <ReviewTable /> */}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <FaqTable search={{ question: search.question }} />
        </CardContent>
      </Card>
    </main>
  );
}
