import Layout from '@pages/Layout/index.js';
import Login from '../pages/Login/index.js';


import { createBrowserRouter } from "react-router";
import {AuthRoute} from "@/components/AuthRoute.jsx";
// import Home from "@pages/Home/index.tsx";
// import Article from "@pages/Article/index.tsx";
// import Publish from "@pages/Publish/index.tsx";
import {lazy, Suspense} from "react";

// 1. lazy函数对组件进行导入
const Home = lazy(() => import('@pages/Home/index.tsx'));
const Article = lazy(() => import('@pages/Article/index.tsx'));
const Publish = lazy(() => import("@pages/Publish/index.tsx"));


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute><Layout/></AuthRoute>,
        children: [
            {
                index: true,
                element: <Suspense fallback={'loading'}><Home/></Suspense>,
            },
            {
                path: "article",
                element: <Suspense fallback={'loading'}><Article/></Suspense>,
            },
            {
                path: "publish",
                element: <Suspense fallback={'loading'}><Publish/></Suspense>,
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
    }
]);

export default router;