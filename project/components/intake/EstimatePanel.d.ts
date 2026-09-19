import { ReactNode } from 'react';
export interface EstimatePanelProps { scope?: string[]; term?: string; budget?: string; status?: 'empty' | 'thinking' | 'building' | 'ready'; onConfirm?: () => void; confirmLabel?: string; style?: React.CSSProperties; }
export declare function EstimatePanel(props: EstimatePanelProps): JSX.Element;
