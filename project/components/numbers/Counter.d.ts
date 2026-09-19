import { ReactNode } from 'react';
export interface CounterProps { value: number; from?: number; duration?: number; decimals?: number; prefix?: string; suffix?: string; size?: 'xl' | 'lg' | 'md' | 'sm'; /** ink default; positive = live/saved; brand = highlighted; inverse on dark */ tone?: 'ink' | 'positive' | 'brand' | 'muted' | 'inverse'; style?: React.CSSProperties; }
export declare function Counter(props: CounterProps): JSX.Element;
