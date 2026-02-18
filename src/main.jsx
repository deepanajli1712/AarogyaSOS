// ResQMed Updated Version - Feb 18, 2026
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Settings from './pages/Settings.jsx'
import Appointments from './pages/Appointments.jsx'
import Reports from './pages/Reports.jsx'
import { AuthLayout, Login } from './components/index.js'
import HospitalLocator from "./pages/HospitalLocator.jsx"
import Signup from './pages/Signup'
import ChatBot from './components/chatbot.jsx'
import HelpingPoints from './pages/HelpingPoints.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
            },
            {
                path: "/login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                ),
            },
            {
                path: "/signup",
                element: (
                    <AuthLayout authentication={false}>
                        <Signup />
                    </AuthLayout>
                ),
            },
            {
                path: "/dashboard",
                element: (
                    <AuthLayout authentication={true}>
                        <Dashboard />
                    </AuthLayout>
                ),
            },
            {
                path: "/sos",
                element: (
                    <AuthLayout authentication={true}>
                        <HospitalLocator />
                    </AuthLayout>
                ),
            },
            {
                path: "/reports",
                element: (
                    <AuthLayout authentication={true}>
                        <Reports />
                    </AuthLayout>
                ),
            },
            {
                path: "/appointments",
                element: (
                    <AuthLayout authentication={true}>
                        <Appointments />
                    </AuthLayout>
                ),
            },
            {
                path: "/settings",
                element: (
                    <AuthLayout authentication={true}>
                        <Settings />
                    </AuthLayout>
                ),
            },
            {
                path: "/chatbot",
                element: (
                    <AuthLayout authentication={true}>
                        <ChatBot />
                    </AuthLayout>
                ),
            },
            {
                path: "/helping-points",
                element: (
                    <AuthLayout authentication={true}>
                        <HelpingPoints />
                    </AuthLayout>
                ),
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>,
)
