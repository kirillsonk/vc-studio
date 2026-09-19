import { ReactNode } from 'react';
export interface DemoBlockProps { title?: string; meta?: string; poster?: ReactNode; ratio?: string; cta?: string; autoload?: boolean; loadingText?: string; /** dark contrast surface — at most one per page */ dark?: boolean; children?: ReactNode; onStart?: () => void; style?: React.CSSProperties; }
export declare function DemoBlock(props: DemoBlockProps): JSX.Element;
