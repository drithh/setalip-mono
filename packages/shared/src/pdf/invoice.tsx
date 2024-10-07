'use client';

import { moneyFormatter } from '#dep/util/local';
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

interface InvoicePdf {
  invoice: {
    id: string;
    date: Date;
    dueDate: Date;
  };
  user: {
    name: string;
    email: string;
    phone: string;
  };
  item: {
    name: string;
    description: string;
    quantity: number;
    price: number;
  };
  price: {
    subtotal: number;
    uniqueCode: number;
    discount: number;
    voucherDiscount: number;
    total: number;
  };
}

export function InvoicePdf(invoice: InvoicePdf) {
  return (
    <Document>
      <Page size="A4" style={tw('font-sans text-base px-16 py-12 bg-white')}>
        <View style={tw('flex flex-row justify-between mt-8')}>
          <View>
            <Text style={tw('text-base font-bold text-gray-800')}>
              Bill to :
            </Text>
            <Text style={tw('text-gray-500')}>{invoice.user.name}</Text>
            <Text style={tw('text-gray-500')}>{invoice.user.email}</Text>
            <Text style={tw('text-gray-500')}>{invoice.user.phone}</Text>
          </View>
          <View style={tw('text-right')}>
            <Text>
              Invoice number:{' '}
              <Text style={tw('text-gray-500')}>{invoice.invoice.id}</Text>
            </Text>
            <Text>
              Invoice date:{' '}
              <Text style={tw('text-gray-500')}>
                {format(invoice.invoice.date, 'MMM dd, yyyy')}
              </Text>
            </Text>
            <Text>
              Due date:{' '}
              <Text style={tw('text-gray-500')}>
                {format(invoice.invoice.date, 'MMM dd, yyyy')}
              </Text>
            </Text>
          </View>
        </View>
        <View style={tw('mt-8')}>
          <View
            style={tw(
              'flex flex-row justify-between border-b border-gray-300 py-2'
            )}
          >
            <Text style={tw('font-semibold flex-1')}>Items</Text>
            <Text style={tw('text-right font-semibold w-32')}>Quantity</Text>
            <Text style={tw('text-right font-semibold w-32')}>Price</Text>
            <Text style={tw('text-right font-semibold w-32')}>Amount</Text>
          </View>
        </View>
        <View
          style={tw(
            'flex flex-row justify-between border-b border-gray-200 py-2'
          )}
        >
          <View style={tw('flex-1')}>
            <Text style={tw('font-medium text-gray-900')}>
              {invoice.item.name}
            </Text>
            <Text style={tw('text-gray-500')}>{invoice.item.description}</Text>
          </View>
          <Text style={tw('text-right w-32 text-gray-500')}>
            {invoice.item.quantity}
          </Text>
          <Text style={tw('text-right w-32 text-gray-500')}>
            {moneyFormatter.format(invoice.item.price)}
          </Text>
          <Text style={tw('text-right w-32 text-gray-500')}>
            {moneyFormatter.format(invoice.item.quantity * invoice.item.price)}
          </Text>
        </View>
        <View style={tw('flex flex-col mt-8 border-t border-gray-300 pt-4')}>
          <View style={tw('flex flex-row justify-between')}>
            <Text style={tw('text-right font-normal text-gray-500')}>
              Subtotal
            </Text>
            <Text style={tw('text-right text-gray-500')}>
              {moneyFormatter.format(invoice.price.subtotal)}
            </Text>
          </View>
          <View style={tw('flex flex-row justify-between')}>
            <Text style={tw('text-right font-normal text-gray-500')}>
              Unique Code
            </Text>
            <Text style={tw('text-right text-gray-500')}>
              {moneyFormatter.format(invoice.price.uniqueCode)}
            </Text>
          </View>
          <View style={tw('flex flex-row justify-between')}>
            <Text style={tw('text-right font-normal text-gray-500')}>
              Discount
            </Text>
            <Text style={tw('text-right text-gray-500')}>
              {moneyFormatter.format(invoice.price.discount)}
            </Text>
          </View>
          <View style={tw('flex flex-row justify-between')}>
            <Text style={tw('text-right font-normal text-gray-500')}>
              Discount Voucher
            </Text>
            <Text style={tw('text-right text-gray-500')}>
              {moneyFormatter.format(invoice.price.voucherDiscount)}
            </Text>
          </View>
          <View style={tw('flex flex-row justify-between')}>
            <Text style={tw('text-right font-semibold text-gray-900')}>
              Total
            </Text>
            <Text style={tw('text-right text-gray-900')}>
              {moneyFormatter.format(invoice.price.total)}
            </Text>
          </View>
        </View>
        <View
          style={tw('text-center text-xs text-gray-500 mt-16 border-t pt-4')}
        >
          <Text>
            Please pay the invoice before the due date. You can pay the invoice
            by logging in to your account from our client portal.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export function InvoiceViewer(data: InvoicePdf) {
  const openPdfInNewTab = async () => {
    const doc = <InvoicePdf {...data} />; // Create PDF
    const blob = await pdf(doc).toBlob(); // Convert PDF to Blob
    const url = URL.createObjectURL(blob); // Create a URL from Blob
    window.open(url, '_blank'); // Open PDF in a new tab
  };

  return (
    <div>
      <button onClick={openPdfInNewTab}>Open Invoice PDF in New Tab</button>
    </div>
  );
}
