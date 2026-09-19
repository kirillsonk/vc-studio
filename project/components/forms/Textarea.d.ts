import { ReactNode } from 'react';
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { error?: boolean; disabled?: boolean; rows?: number; }
export declare function Textarea(props: TextareaProps): JSX.Element;
