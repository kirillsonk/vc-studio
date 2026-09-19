import { ReactNode } from 'react';
export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> { error?: boolean; disabled?: boolean; prefix?: ReactNode; suffix?: ReactNode; }
export declare function TextInput(props: TextInputProps): JSX.Element;
