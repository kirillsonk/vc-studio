import { ReactNode } from 'react';
export interface CaseCardProps { title: string; kind?: string; year?: string | number; client?: string; days?: number; budget?: number; media?: ReactNode; ratio?: string; href?: string; onClick?: () => void; size?: 'md' | 'lg'; style?: React.CSSProperties; }
export declare function CaseCard(props: CaseCardProps): JSX.Element;
