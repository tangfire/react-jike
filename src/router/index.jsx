import Layout from '@pages/Layout/index.js';
import Login from '../pages/Login/index.js';


import { createBrowserRouter } from "react-router";
import {AuthRoute} from "@/components/AuthRoute.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute><Layout/></AuthRoute>,
    },
    {
        path: "/login",
        element: <Login />,
    }
]);

export default router;