import Layout from '@pages/Layout/index.js';
import Login from '../pages/Login/index.js';


import { createBrowserRouter } from "react-router";
import {AuthRoute} from "@/components/AuthRoute.jsx";
import Home from "@pages/Home/index.tsx";
import Article from "@/pages/Article/index.jsx";
import Publish from "@pages/Publish/index.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute><Layout/></AuthRoute>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "article",
                element: <Article/>
            },
            {
                path: "publish",
                element: <Publish/>
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
    }
]);

export default router;