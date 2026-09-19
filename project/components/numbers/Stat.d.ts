import { ReactNode } from 'react';
export interface StatProps { value: number | string; label?: ReactNode; note?: ReactNode; tone?: 'ink' | 'positive' | 'brand' | 'inverse'; size?: 'xl' | 'lg' | 'md' | 'sm'; animate?: boolean; prefix?: string; suffix?: string; decimals?: number; style?: React.CSSProperties; }
export declare function Stat(props: StatProps): JSX.Element;
