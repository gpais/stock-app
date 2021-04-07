
export interface Stock {
    symbol: string;
    company: string;
    purchased: boolean;
    followed: boolean;
    expanded: boolean;
    followedDate: Date;
    userId: string;
}
