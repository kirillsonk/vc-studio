import { ReactNode } from 'react';
export interface OptionBlockProps { selected?: boolean; disabled?: boolean; onClick?: () => void; /** right-aligned small text, e.g. a range */ meta?: ReactNode; children: ReactNode; style?: React.CSSProperties; }
export declare function OptionBlock(props: OptionBlockProps): JSX.Element;
