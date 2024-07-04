import { container, TYPES } from '@repo/shared/inversify';
import { SelectAllReview, SelectReviewWithUser } from '@repo/shared/repository';
import { WebSettingService } from '@repo/shared/service';
import Marquee from '@repo/ui/components/marquee';
import { StarHalfIcon, StarIcon } from 'lucide-react';
import { dateFormatter } from '@repo/shared/util';

const ReviewCard = ({ review }: { review: SelectReviewWithUser }) => {
  return (
    <figure className="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-background p-4">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {review.name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">
            Joined since {dateFormatter().format(review.joined_at)}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {/* rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const fillClass = 'text-secondary fill-current';
            const emptyClass = 'text-gray-300 fill-current';
            const stars = review.rating / 2;
            const isFilled = i < Math.floor(stars);
            const isHalfFilled = i < stars && i >= Math.floor(stars);

            return (
              <span key={i} className="relative">
                <StarIcon
                  className={`h-4 w-4 ${isFilled ? fillClass : emptyClass}`}
                />
                {isHalfFilled && (
                  <StarHalfIcon
                    className={`absolute left-0 top-0 h-4 w-4 ${fillClass}`}
                  />
                )}
              </span>
            );
          })}
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{review.review}</blockquote>
    </figure>
  );
};

export async function Review() {
  const webSettingService = container.get<WebSettingService>(
    TYPES.WebSettingService,
  );

  const reviewQuery = await webSettingService.findAllReview({
    perPage: 100,
  });
  const reviews = reviewQuery.result?.data ?? [];

  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg  py-2">
      <Marquee pauseOnHover className="hidden [--duration:40s] md:inline-flex ">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Marquee>
      <Marquee pauseOnHover className="[--duration:40s] md:hidden">
        {firstRow.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:40s] md:hidden">
        {secondRow.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Marquee>
    </div>
  );
}
