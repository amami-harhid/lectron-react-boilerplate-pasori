export const routePath = {
    Home: '/',
    Top: '/top',
    Stop: '/stop',
    HistoriesListPage: '/historieslistpage',
    IdmRegister: '/idmregisterpage',
    MemberListPage: '/memberlistpage',
    MemberTrashedListPage: '/membertrashedlistpage',
} as const;

export type TRoutePath =  (typeof routePath)[keyof typeof routePath];
