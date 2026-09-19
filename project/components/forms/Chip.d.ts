import { ReactNode } from 'react';
export interface ChipProps { selected?: boolean; disabled?: boolean; onClick?: () => void; children: ReactNode; style?: React.CSSProperties; }
export declare function Chip(props: ChipProps): JSX.Element;
