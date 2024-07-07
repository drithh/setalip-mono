import { container, TYPES } from '@repo/shared/inversify';
import { WebSettingService } from '@repo/shared/service';
import RichTextViewer from '@repo/ui/components/rich-text/viewer';

export default async function Page() {
  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );

  const privacyPolicy = await webSettingService.findPrivacyPolicy();
  const termsAndConditions = await webSettingService.findTermsAndConditions();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Terms of Service & Privacy Policy
          </h1>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Terms of Service</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <RichTextViewer
              value={termsAndConditions.result ?? ''}
              className="border-0 text-xl"
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Privacy Policy</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <RichTextViewer
              value={privacyPolicy.result ?? ''}
              className="border-0 text-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
