import { ReactNode } from 'react';
export interface FieldProps { label?: ReactNode; hint?: ReactNode; error?: ReactNode; required?: boolean; htmlFor?: string; children: ReactNode; style?: React.CSSProperties; }
export declare function Field(props: FieldProps): JSX.Element;
