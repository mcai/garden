export interface SimplePlan {
    name: string;

    action: (params: any) => void;
}
