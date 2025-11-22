import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
    RouterProvider,
} from "react-router"
import router from "@/router"
import { Layout} from "antd";
import { Content } from 'antd/es/layout/layout'
import store from './store'
import { Provider } from 'react-redux'
import 'normalize.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <RouterProvider router={router}></RouterProvider>
      </Provider>


  </StrictMode>,
)
