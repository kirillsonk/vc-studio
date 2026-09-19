import { ReactNode } from 'react';
export interface BriefComposerProps { placeholder?: string; value?: string; onChange?: (v: string) => void; onSend?: (text: string) => void; disabled?: boolean; style?: React.CSSProperties; }
export declare function BriefComposer(props: BriefComposerProps): JSX.Element;
