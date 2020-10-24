export interface SimplePlan {
    name: string;

    every: string;

    action: (params: any) => void;
}
