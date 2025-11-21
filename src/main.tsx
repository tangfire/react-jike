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



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Layout style={{ minHeight: '100vh' }}>
          <Content style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
          }}>
             <Provider store={store}>
                 <RouterProvider router={router}></RouterProvider>
             </Provider>
          </Content>
      </Layout>


  </StrictMode>,
)
