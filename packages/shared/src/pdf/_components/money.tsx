import { decimalFormatter } from '#dep/util/index';
import { Text, View } from '@react-pdf/renderer';
import { Style } from './type';

interface MoneyProps {
  amount: number;
  tw: (input: string) => Style;
}

export const Money = ({ amount, tw }: MoneyProps) => {
  return (
    <View style={tw('text-sm font-medium w-40 flex flex-row justify-between')}>
      <Text>Rp</Text>
      <Text>{decimalFormatter.format(amount)}</Text>
    </View>
  );
};
