export declare const isRich: (opts?: {
    json?: boolean;
    plain?: boolean;
}) => boolean;
export declare const pad: (value: string, size: number) => string;
export declare const formatKey: (key: string, rich: boolean) => string;
export declare const formatValue: (value: string, rich: boolean) => string;
export declare const formatKeyValue: (key: string, value: string, rich: boolean, valueColor?: (value: string) => string) => string;
export declare const formatSeparator: (rich: boolean) => string;
export declare const formatTag: (tag: string, rich: boolean) => string;
export declare const truncate: (value: string, max: number) => string;
export declare const maskApiKey: (value: string) => string;
