import { ReactNode } from 'react';
export interface CompareProps { ours: number | [number, number]; theirs: number | [number, number]; ourLabel?: string; theirLabel?: string; unit?: string; savingLabel?: string; note?: ReactNode; style?: React.CSSProperties; }
export declare function Compare(props: CompareProps): JSX.Element;
