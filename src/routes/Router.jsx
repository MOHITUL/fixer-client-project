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
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../pages/profile/Profile";
import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import MyIssues from "../pages/citizen/MyIssues";
import ReportIssue from "../pages/citizen/ReportIssue";
import CitizenProfile from "../pages/citizen/CitizenProfile";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsersPage from "../pages/admin/ManageUsersPage";
import ManageStaff from "../pages/admin/ManageStaff";
import PaymentPage from "../pages/admin/PaymentPage";
import AdminAllIssues from "../pages/admin/AdminAllIssues";
import AdminProfile from "../pages/admin/AdminProfile";


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
            },
            {
                path:"profile",
                element: (<PrivateRoute>
                    <Profile/>
                </PrivateRoute>)
            },
            // citizen
            {
                path:"citizen/dashboard",
                element: (<PrivateRoute><CitizenDashboard/></PrivateRoute>)
            },
            {
                path: "citizen/issues",
                element: (<PrivateRoute><MyIssues/></PrivateRoute>)
            },
            {
                path: "citizen/report",
                element: (<PrivateRoute><ReportIssue/></PrivateRoute>)
            },
            {
                path: "citizen/profile",
                element: (<PrivateRoute><CitizenProfile/></PrivateRoute>)
            },

            // admin
            {
                path: "admin/dashboard",
                element:(<PrivateRoute><AdminDashboard/></PrivateRoute>)
            },
            {
                path: "admin/manage-users",
                element:(<PrivateRoute><ManageUsersPage/></PrivateRoute>)
            },
            {
                path: "admin/manage-staff",
                element:(<PrivateRoute><ManageStaff/></PrivateRoute>)
            },
            {
                path: "admin/payments",
                element:(<PrivateRoute><PaymentPage/></PrivateRoute>)
            },
            {
                path: "admin/all-issues",
                element:(<PrivateRoute><AdminAllIssues/></PrivateRoute>)
            },
            {
                path: "admin/profile",
                element:(<PrivateRoute><AdminProfile/></PrivateRoute>)
            },
            

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