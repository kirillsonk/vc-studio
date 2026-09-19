import { ReactNode } from 'react';
export interface TraceProps { /** stage names or nodes */ steps?: ReactNode[]; /** index of the current stage; >= steps.length-1 marks production reached (green) */ active?: number; labels?: boolean; vertical?: boolean; style?: React.CSSProperties; }
export declare function Trace(props: TraceProps): JSX.Element;
