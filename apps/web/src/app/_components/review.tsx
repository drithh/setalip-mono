import { StarFilledIcon } from '@radix-ui/react-icons';
import Marquee from '@repo/ui/components/marquee';
import { StarHalfIcon, StarIcon } from 'lucide-react';

const reviews = [
  {
    name: 'Jack',
    joined: '12-12-2022',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    rating: 10,
  },
  {
    name: 'Jill',
    joined: '12-12-2022',
    body: "I don't know what to say. I'm speechless. This is amazing.",
    rating: 9,
  },
  {
    name: 'John',
    joined: '12-12-2022',
    body: "I'm at a loss for words. This is amazing. I love it.",
    rating: 5,
  },
  {
    name: 'Jane',
    joined: '12-12-2022',
    body: "I'm at a loss for words. This is amazing. I love it.",
    rating: 8,
  },
  {
    name: 'Jenny',
    joined: '12-12-2022',
    body: "I'm at a loss for words. This is amazing. I love it.",
    rating: 8,
  },
  {
    name: 'James',
    joined: '12-12-2022',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    rating: 7,
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  rating,
  name,
  joined,
  body,
}: {
  rating: number;
  name: string;
  joined: string;
  body: string;
}) => {
  return (
    <figure className="relative w-64 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-background p-4">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{joined}</p>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {/* rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const fillClass = 'text-secondary fill-current';
            const emptyClass = 'text-gray-300 fill-current';
            const stars = rating / 2;
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
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Review() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-primary py-2">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div> */}
      {/* <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div> */}
    </div>
  );
}
