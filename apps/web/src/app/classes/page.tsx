import { TYPES, container } from '@repo/shared/inversify';
import { ClassService } from '@repo/shared/service';
import { MultiSelect } from '@repo/ui/components/multi-select';
// import { findAllClasseschema } from '@repo/shared/api/schema';
import { moneyFormatter } from '@repo/shared/util';
import { Separator } from '@repo/ui/components/ui/separator';
import { Button } from '@repo/ui/components/ui/button';
import Class from './class';

export default async function Classes({ searchParams }: { searchParams: any }) {
  // const search = findAllClasseschema.parse(searchParams);

  const classService = container.get<ClassService>(TYPES.ClassService);
  const classes = await classService.findAllClassWithAsset({
    perPage: 100,
  });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[90vw] flex-col gap-24 px-8 py-4 sm:py-20 md:max-w-screen-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-sm text-gray-500">
            {classes.result?.data.length} classes found
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {classes.result?.data.map((singleClass) => (
            <Class key={singleClass.id} singleClass={singleClass} />
          ))}
        </div>
      </div>
    </div>
  );
}
