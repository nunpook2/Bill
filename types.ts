
export enum BillMode {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY'
}

export interface BillRecord {
  id?: string;
  type: BillMode;
  number: number; // Table number or Queue number
  timestamp: any;
  total?: number;
}
