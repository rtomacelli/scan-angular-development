import { ToolButtonClass } from '@models/ui';

export interface ToolButton {
    name: string;
    icon: string;
    title?: string;
    route: string;
    class?: ToolButtonClass;
    enabled?: boolean;
}
