import React, {useState, useEffect} from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { routePath } from './routePath';
import { HomePage } from './pages/homePage';
import { TopPage } from './pages/topPage';
import { StopPage } from './pages/stopPage';
import { HistoriesPage } from './pages/historiesPage';
import { IdmRegisterPage } from './pages/idmRegisterPage';
import { MemberListPage } from './pages/memberListPage'

import './css/app.css';

const IPCNavigator = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (window.navigate) {
            window.navigate.onNavigate(async (_path:string) => {
                await navigate(_path, {replace:false});
            });
        }
    },
    // 第二引数は空配列とする。
    // ページ表示後にページごとにuseEffectが実行されてしまい
    // 同じパスへのnavigate(path)がページごとに実行されてしまうことを回避する。
    []);

    return (
        <></>
    )
}

export function App() {
    const [path, ] = useState<typeof routePath>(routePath)
    return (
        <>
            <Router>
                <IPCNavigator/>
                <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path={path.Top} element={<TopPage />} />
                        <Route path={path.Stop} element={<StopPage />} />
                        <Route path={path.Histories} element={<HistoriesPage />} />
                        <Route path={path.IdmRegister} element={<IdmRegisterPage />} />
                        <Route path={path.MemberListPage} element={<MemberListPage/>} />
                </Routes>
            </Router>
        </>
    );

}
