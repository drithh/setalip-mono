import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { BackButton } from '@repo/ui/components/back-button';
import { Label } from '@repo/ui/components/ui/label';
import { Input } from '@repo/ui/components/ui/input';
import { container, TYPES } from '@repo/shared/inversify';
import { WebSettingService } from '@repo/shared/service';
import { ImageWithFallback } from '@/lib/image-with-fallback';
import FaqTable from './_components/faq-table';
import { findAllDepositReviewFaqSchema } from '@repo/shared/api/schema';
import DepositAccountTable from './_components/deposit-account-table';
import EditWebSettingForm from './edit-web-settings.form';
import CarouselTable from './_components/carousel-table';
import RichTextViewer from '@repo/ui/components/rich-text/viewer';
interface IndexPageProps {
  searchParams: Promise<Record<string, any>>;
}

export default async function Page(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = findAllDepositReviewFaqSchema.parse(searchParams);

  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );
  const contact = await webSettingService.findContact();
  const logo = await webSettingService.findLogo();
  const termsAndConditions = await webSettingService.findTermsAndConditions();
  const privacyPolicy = await webSettingService.findPrivacyPolicy();

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:gap-6">
      <BackButton />
      <Card>
        <CardHeader className="flex flex-row place-content-between items-center">
          <CardTitle className="w-fit">Settings</CardTitle>
          <EditWebSettingForm
            webSetting={{
              instagram_handle: contact.result?.instagram_handle ?? '',
              tiktok_handle: contact.result?.tiktok_handle ?? '',
              logo: null,
              url: logo.result?.logo ?? '',
              terms_and_conditions: termsAndConditions.result ?? '',
              privacy_policy: privacyPolicy.result ?? '',
            }}
          />
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
                  defaultValue={contact.result?.instagram_handle}
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
                  defaultValue={contact.result?.tiktok_handle}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="address">Terms and Conditions</Label>
              <RichTextViewer
                value={termsAndConditions.result ?? ''}
                className="text-sm"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phone">Privacy Policy</Label>
              <RichTextViewer
                value={privacyPolicy.result ?? ''}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carousel</CardTitle>
        </CardHeader>
        <CardContent>
          <CarouselTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deposit Account</CardTitle>
        </CardHeader>
        <CardContent>
          <DepositAccountTable search={{ name: search.name }} />
        </CardContent>
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
