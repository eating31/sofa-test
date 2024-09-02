import React from 'react'
import ClientApp from './client/App';
import AdminApp from './admin/App'
import Home from './Home';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin" element={<AdminApp />} />
                    <Route path="/admin/*" element={<AdminApp />} />
                    <Route path="/client/*" element={<ClientApp />} />
                    {/* <Route key="notFound" path="*" element={<Navigate replace to="/client/eTracking" />} /> */}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App