export const routePath = {
    Home: '/',
    Top: '/top',
    Stop: '/stop',
    Histories: '/histories',
    IdmRegister: '/idmregister',
    MemberListPage: '/memberlistpage',
} as const;

export type TRoutePath =  (typeof routePath)[keyof typeof routePath];
