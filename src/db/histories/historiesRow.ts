export type HistoriesRow = {
    id?: number;
    idm: string; 
    fcno: string;
    in_room?: boolean; 
    date_in?: string;
    date_out?: string;
    date_time?: string;
}

export type HistoriesCardRow = {
    id?: number;
    idm: string; 
    fcno: string;
    name?: string;
    kana?: string;
    mail?: string;
    in_room?: boolean; 
    date_in?: string;
    date_out?: string;
    date_time?: string;
}