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
import { Money } from './_components/money';
import { moneyFormatter } from '../util';
import { Report } from './_components/type';
import LocationStatement from './_components/location-statement';
import { HeaderPdf } from './_components/header';

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

export function ReportPdf(report: Report) {
  return (
    <Document>
      <LocationStatement tw={tw} report={report} />
      {report.outcome.coach.map((coach, index) => (
        <Page size="A4" style={tw('font-sans text-base px-16 py-12 bg-white')}>
          <HeaderPdf tw={tw} />
          <View style={tw('flex flex-row justify-between mt-8')}>
            <View>
              <Text style={tw('text-xl text-[#738864] font-bold')}>
                Coach {coach.name}
              </Text>
            </View>
          </View>

          <View style={tw('mt-5')}>
            <View style={tw('border-y m-0 p-0 border-gray-300')}>
              <View
                style={tw(
                  'flex flex-row justify-between py-1 border-b px-2 gap-4 border-gray-300'
                )}
              >
                <Text style={tw('text-sm  flex-1')}>Tipe Kelas</Text>
                <Text style={tw('text-sm text-center w-24')}>Jumlah</Text>
                <Text style={tw('text-sm text-right font-medium w-36')}>
                  Rate
                </Text>
                <Text style={tw('text-sm text-right font-medium w-36')}>
                  Total
                </Text>
              </View>
              {coach.classType.map((item, index) => (
                <View
                  key={index}
                  style={tw('flex flex-row justify-between px-2 gap-4')}
                >
                  <Text style={tw('text-sm flex-1')}>{item.name}</Text>
                  <Text style={tw('text-sm text-center w-24')}>
                    {item.amount}
                  </Text>
                  <Money tw={tw} amount={item.rate} />
                  <Money tw={tw} amount={item.amount * item.rate} />
                </View>
              ))}
              <View
                style={tw(
                  'flex flex-row justify-between mt-2 py-1 border-t px-2 border-gray-300'
                )}
              >
                <Text style={tw('text-sm font-semibold flex-1')}>Total</Text>
                <Text style={tw('text-sm text-center w-32')}></Text>
                <Money
                  tw={tw}
                  amount={coach.classType.reduce(
                    (a, c) => a + c.amount * c.rate,
                    0
                  )}
                />
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}

export async function openReportPDF(data: Report) {
  const doc = <ReportPdf {...data} />; // Create PDF
  const blob = await pdf(doc).toBlob(); // Convert PDF to Blob
  const url = URL.createObjectURL(blob); // Create a URL from Blob
  window.open(url, '_blank'); // Open PDF in a new tab
}
