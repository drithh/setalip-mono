import { SelectClassType__Income } from '@repo/shared/service';
import { moneyFormatter } from '@repo/shared/util';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@repo/ui/components/ui/table';

interface IncomeProps {
  income: SelectClassType__Income[];
}

export default function Income(data: IncomeProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class Type</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead className="w-72">Income</TableHead>
          <TableHead className="w-72"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.income.map((income) => (
          <TableRow key={income.id}>
            <TableCell>{income.type}</TableCell>
            <TableCell>{income.participant}</TableCell>
            <TableCell>{moneyFormatter.format(income.income)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
