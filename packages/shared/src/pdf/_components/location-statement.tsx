import { moneyFormatter } from '#dep/util/local';
import { Page, View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Money } from './money';
import { Style, Report } from './type';

interface LocationStatementProps {
  tw: (input: string) => Style;
  report: Report;
}

export default function LocationStatement({
  tw,
  report,
}: LocationStatementProps) {
  const totalIncome = report.income.agenda.reduce(
    (acc, curr) => acc + parseFloat(curr.amount.toString()),
    0
  );
  const coachOutcome = report.outcome.coach.reduce(
    (acc, curr) =>
      acc +
      curr.classType.reduce((a, c) => a + c.amount * c.rate, 0) +
      curr.transport.amount * curr.transport.rate,
    0
  );
  const customOutcome = report.outcome.custom.reduce(
    (acc, curr) => acc + curr.total,
    0
  );
  const totalOutcome = coachOutcome + customOutcome;
  return (
    <Page size="A4" style={tw('font-sans text-base px-16 py-12 bg-white')}>
      <View
        style={tw('flex flex-row gap-4 w-full justify-between items-center')}
      >
        <View>
          <Text style={tw('text-3xl leading-5 font-bold text-[#738864]')}>
            {report.report.locationName}
          </Text>
        </View>
        <View style={tw('text-right w-64')}>
          <Text style={tw('text-2xl  font-medium leading-5')}>
            Income Statement
          </Text>
          <Text style={tw('text-lg font-medium text-gray-500')}>
            Report date: {format(report.report.date, 'MMMM, yyyy')}
          </Text>
        </View>
      </View>

      <View style={tw('mt-5')}>
        <Text style={tw('text-lg font-bold text-[#738864]')}>Pendapatan</Text>
        <View style={tw('border-y m-0 p-0 border-gray-300')}>
          <View
            style={tw(
              'flex flex-row gap-4 justify-between py-1 border-b px-2 border-gray-300'
            )}
          >
            <Text style={tw('text-sm  flex-1')}>Nama</Text>
            <Text style={tw('text-sm text-center  w-24')}>Total</Text>
            <Text style={tw('text-sm text-right font-medium w-36')}>
              Pendapatan
            </Text>
            <Text style={tw('text-sm text-right font-medium w-36')}>
              Pengeluaran
            </Text>
          </View>
          <View style={tw('flex flex-row gap-4 justify-between py-1 px-2')}>
            <Text style={tw('text-sm flex-1 font-semibold')}>Tipe Kelas</Text>
          </View>
          {report.income.agenda.map((item, index) => (
            <View
              key={index}
              style={tw('ml-8 flex flex-row gap-4 justify-between px-2')}
            >
              <Text style={tw('text-sm flex-1')}>{item.name}</Text>
              <Text style={tw('text-sm text-center w-24')}>{item.total}</Text>
              <Money tw={tw} amount={item.amount} />
              <Text style={tw('text-sm text-right font-medium w-36')}></Text>
            </View>
          ))}
          <View
            style={tw(
              'flex flex-row gap-4 justify-between mt-2 py-1 border-t px-2 border-gray-300'
            )}
          >
            <Text style={tw('text-sm font-semibold flex-1')}>Total</Text>
            <Text style={tw('text-sm text-center w-24')}></Text>
            <Money tw={tw} amount={totalIncome} />
          </View>
        </View>
      </View>

      <View style={tw('mt-5')}>
        <Text style={tw('text-lg font-bold text-[#738864]')}>Pengeluaran</Text>
        <View style={tw('border-y m-0 p-0 border-gray-300')}>
          <View style={tw('flex flex-row gap-4 justify-between py-1 px-2')}>
            <Text style={tw('text-sm flex-1 font-semibold')}>Coach</Text>
          </View>
          {report.outcome.coach.map((item, index) => (
            <View
              key={index}
              style={tw('ml-8 flex flex-row gap-4 justify-between px-2')}
            >
              <Text style={tw('text-sm flex-1')}>{item.name}</Text>
              <Text style={tw('text-sm text-center w-24')}></Text>
              <Text style={tw('text-sm text-right font-medium w-36')}></Text>
              <Money
                tw={tw}
                amount={
                  item.classType.reduce((a, c) => a + c.amount * c.rate, 0) +
                  item.transport.amount * item.transport.rate
                }
              />
            </View>
          ))}

          {report.outcome.custom.map((item, index) => (
            <View
              key={index}
              style={tw('flex flex-row gap-4 justify-between px-2')}
            >
              <Text style={tw('text-sm flex-1')}>{item.name}</Text>
              <Text style={tw('text-sm text-center w-24')}></Text>
              <Text style={tw('text-sm text-right font-medium w-36')}></Text>
              <Money tw={tw} amount={item.total} />
            </View>
          ))}
          <View
            style={tw(
              'flex flex-row gap-4 justify-between mt-2 py-1 border-t px-2 border-gray-300'
            )}
          >
            <Text style={tw('text-sm font-semibold flex-1')}>Total</Text>
            <Text style={tw('text-sm text-center w-24')}></Text>
            <Text style={tw('text-sm text-right font-medium w-36')}></Text>
            <Money tw={tw} amount={totalOutcome} />
          </View>
        </View>
      </View>

      <View style={tw('mt-5 flex flex-row gap-4')}>
        <Text style={tw('text-lg font-bold text-[#738864] flex-1')}>Total</Text>
        <Text style={tw('text-sm text-right font-medium w-24')}></Text>
        <Text
          style={tw(
            'text-lg font-bold text-center font-medium w-72 text-[#738864]'
          )}
        >
          {moneyFormatter.format(totalIncome - totalOutcome)}
        </Text>
      </View>
    </Page>
  );
}
