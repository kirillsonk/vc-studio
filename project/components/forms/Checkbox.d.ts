import { ReactNode } from 'react';
export interface CheckboxProps { checked?: boolean; defaultChecked?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; label?: ReactNode; style?: React.CSSProperties; }
export declare function Checkbox(props: CheckboxProps): JSX.Element;
