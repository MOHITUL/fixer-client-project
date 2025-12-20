import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import ErrorPage from "../pages/error/ErrorPage";
import AllIssues from "../pages/issues/AllIssues";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";


export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        errorElement: <ErrorPage/>,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "all-issues",
                Component: AllIssues,
            },
            {
                path: "about",
                Component: About,
            },
            {
                path: "contact",
                Component: Contact,
            }
        ]
    },
    {
        path:'/',
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    }

])