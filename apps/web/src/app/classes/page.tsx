import { container, TYPES } from '@repo/shared/inversify';
import { ClassService, ClassTypeService } from '@repo/shared/service';
// import { findAllClasseschema } from '@repo/shared/api/schema';

import ListClass from './list-class';

export default async function Classes({ searchParams }: { searchParams: any }) {
  // const search = findAllClasseschema.parse(searchParams);

  const classService = container.get<ClassService>(TYPES.ClassService);
  const classes = await classService.findAllClassWithAsset({
    perPage: 100,
  });

  const classTypeService = container.get<ClassTypeService>(
    TYPES.ClassTypeService,
  );
  const classTypes = await classTypeService.findAll();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[95vw] flex-col  px-8 py-4 sm:py-20 md:max-w-screen-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Classes</h1>
        </div>
      </div>
      <ListClass
        classes={classes.result?.data ?? []}
        classTypes={classTypes.result ?? []}
      />
    </div>
  );
}
