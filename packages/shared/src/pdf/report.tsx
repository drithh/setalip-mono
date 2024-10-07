'use client';

import {
  Document,
  Page,
  Text,
  View,
  Image,
  pdf,
  Font,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { createTw } from 'react-pdf-tailwind';
import { LayoutPdf } from './_components/layout';
import { Money } from './_components/money';

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf',
      fontWeight: 100,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf',
      fontWeight: 200,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf',
      fontWeight: 300,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
      fontWeight: 400,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
      fontWeight: 500,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
      fontWeight: 600,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
      fontWeight: 700,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
      fontWeight: 800,
    },
    {
      src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf',
      fontWeight: 900,
    },
  ],
});

// Define your Tailwind configuration
const tw = createTw({
  theme: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui'],
    },
  },
});

interface Statement {
  name: string;
  total: number;
}

interface AgendaStatement extends Statement {
  amount: number;
}

interface CoachRateStatement {
  name: string;
  amount: number;
  rate: number;
}

interface CoachStatement {
  name: string;
  transport: {
    amount: number;
    rate: number;
  };
  classType: CoachRateStatement[];
}

interface ReportPdf {
  report: {
    locationName: string;
    date: Date;
  };
  income: {
    agenda: AgendaStatement[];
  };
  outcome: {
    coach: CoachStatement[];
    custom: Statement[];
  };
}

export function ReportPdf(report: ReportPdf) {
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
    <LayoutPdf tw={tw}>
      <View style={tw('flex flex-row w-full justify-between items-center')}>
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
              'flex flex-row justify-between py-1 border-b px-2 border-gray-300'
            )}
          >
            <Text style={tw('text-sm  flex-1')}>Nama</Text>
            <Text style={tw('text-sm text-center  w-32')}>Total</Text>
            <Text style={tw('text-sm text-right font-medium w-40')}>
              Pendapatan
            </Text>
            <Text style={tw('text-sm text-right font-medium w-40')}>
              Pengeluaran
            </Text>
          </View>
          <View style={tw('flex flex-row justify-between py-1 px-2')}>
            <Text style={tw('text-sm flex-1 font-semibold')}>Tipe Kelas</Text>
          </View>
          {report.income.agenda.map((item, index) => (
            <View
              key={index}
              style={tw('ml-8 flex flex-row justify-between px-2')}
            >
              <Text style={tw('text-sm flex-1')}>{item.name}</Text>
              <Text style={tw('text-sm text-center w-32')}>{item.total}</Text>
              <Money tw={tw} amount={item.amount} />
              <Text style={tw('text-sm text-right font-medium w-40')}></Text>
            </View>
          ))}
          <View
            style={tw(
              'flex flex-row justify-between mt-2 py-1 border-t px-2 border-gray-300'
            )}
          >
            <Text style={tw('text-sm font-semibold flex-1')}>Total</Text>
            <Text style={tw('text-sm text-center w-32')}></Text>
            <Money tw={tw} amount={totalIncome} />
            <Text style={tw('text-sm text-right font-medium w-40')}></Text>
          </View>
        </View>
      </View>

      <View style={tw('mt-5')}>
        <Text style={tw('text-lg font-bold text-[#738864]')}>Pengeluaran</Text>
        <View style={tw('border-y m-0 p-0 border-gray-300')}>
          <View style={tw('flex flex-row justify-between py-1 px-2')}>
            <Text style={tw('text-sm flex-1 font-semibold')}>Coach</Text>
          </View>
          {report.outcome.coach.map((item, index) => (
            <View
              key={index}
              style={tw('ml-8 flex flex-row justify-between px-2')}
            >
              <Text style={tw('text-sm flex-1')}>{item.name}</Text>
              <Text style={tw('text-sm text-center w-32')}></Text>
              <Text style={tw('text-sm text-right font-medium w-40')}></Text>
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
            <View key={index} style={tw('flex flex-row justify-between px-2')}>
              <Text style={tw('text-sm flex-1')}>{item.name}</Text>
              <Text style={tw('text-sm text-center w-32')}></Text>
              <Text style={tw('text-sm text-right font-medium w-40')}></Text>
              <Money tw={tw} amount={item.total} />
            </View>
          ))}
          <View
            style={tw(
              'flex flex-row justify-between mt-2 py-1 border-t px-2 border-gray-300'
            )}
          >
            <Text style={tw('text-sm font-semibold flex-1')}>Total</Text>
            <Text style={tw('text-sm text-center w-32')}></Text>
            <Text style={tw('text-sm text-right font-medium w-40')}></Text>
            <Money tw={tw} amount={totalOutcome} />
          </View>
        </View>
      </View>
    </LayoutPdf>
  );
}

export async function openReportPDF(data: ReportPdf) {
  const doc = <ReportPdf {...data} />; // Create PDF
  const blob = await pdf(doc).toBlob(); // Convert PDF to Blob
  const url = URL.createObjectURL(blob); // Create a URL from Blob
  window.open(url, '_blank'); // Open PDF in a new tab
}
