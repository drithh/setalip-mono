import { Styles } from '@react-pdf/renderer';

export type Style = Styles[keyof Styles];

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

export interface Report {
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
