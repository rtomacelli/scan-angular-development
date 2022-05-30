export interface ScanTreeNode {
    'dataId': string | number;
    'segment'?: string;
    'code'?: string;
    'name': string;
    'title'?: string;
    'data'?: any;
    'relatedApps'?: string[];
    'styleClass'?: string;
    'children'?: ScanTreeNode[];
    'closeable'?: boolean;
    'closed'?: boolean;
    'marked'?: boolean;
    'highlighted'?: boolean;
    'primary'?: boolean;
    'hasDetails'?: boolean;
}
