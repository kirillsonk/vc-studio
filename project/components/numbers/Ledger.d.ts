import { ReactNode } from 'react';
export interface LedgerProps { title?: string; rows: Array<{ label: ReactNode; sub?: ReactNode; value: number | string; tone?: 'ink' | 'positive' | 'muted' | 'brand' }>; total?: number | string; totalLabel?: string; note?: ReactNode; dense?: boolean; style?: React.CSSProperties; }
export declare function Ledger(props: LedgerProps): JSX.Element;
