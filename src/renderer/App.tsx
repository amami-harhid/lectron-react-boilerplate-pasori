import React, {useEffect} from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import {TopPage} from './pages/topPage';
import {StopPage} from './pages/stopPage';
import {HistoriesPage} from './pages/historiesPage';
import {IdmRegisterPage} from './pages/idmRegisterPage';

import './css/app.css';

export function IPCNavigator() {
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

        return (
            <>
            <Router>
                <IPCNavigator/>
                <Routes>
                        <Route path="/" element={<TopPage />} />
                        <Route path="/Top" element={<TopPage />} />
                        <Route path="/Stop" element={<StopPage />} />
                        <Route path="/Histories" element={<HistoriesPage />} />
                        <Route path="/IdmRegister" element={<IdmRegisterPage />} />
                </Routes>
            </Router>
            </>
        );

}
