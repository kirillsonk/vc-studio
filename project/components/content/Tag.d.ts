import { ReactNode } from 'react';
export interface TagProps { children: ReactNode; tone?: 'default' | 'brand' | 'ink'; style?: React.CSSProperties; }
export declare function Tag(props: TagProps): JSX.Element;
