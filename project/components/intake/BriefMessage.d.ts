import { ReactNode } from 'react';
export interface BriefMessageProps { role?: 'ai' | 'user'; /** question number, shown as 01 02 … */ index?: number; pending?: boolean; children?: ReactNode; style?: React.CSSProperties; }
export declare function BriefMessage(props: BriefMessageProps): JSX.Element;
