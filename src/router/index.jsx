import Layout from '../pages/Layout';
import Login from '../pages/Login/index.js';


import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
    },
    {
        path: "/login",
        Component: Login,
    }
]);

export default router;