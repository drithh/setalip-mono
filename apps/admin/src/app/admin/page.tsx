import { TYPES, container } from '@repo/shared/inversify';
import { DashboardService } from '@repo/shared/service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { User2 } from 'lucide-react';

export default async function Home() {
  const dashboardService = container.get<DashboardService>(
    TYPES.DashboardService,
  );
  const data = await dashboardService.countUser();

  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <Card className="relative z-0 flex flex-col overflow-hidden">
          <div className="absolute -bottom-6 -left-6 -z-10">
            <User2 className="h-36 w-36 text-gray-200" />
          </div>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>
              Total users that registered in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{data?.result} Users</div>
          </CardContent>
        </Card>
        <Card></Card>
        <Card></Card>
        <Card className="h-80"></Card>
        <Card className="col-span-2"></Card>
      </div>
    </main>
  );
}
