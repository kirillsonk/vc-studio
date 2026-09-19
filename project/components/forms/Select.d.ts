import { ReactNode } from 'react';
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { error?: boolean; disabled?: boolean; options: Array<string | { value: string; label: string }>; placeholder?: string; }
export declare function Select(props: SelectProps): JSX.Element;
