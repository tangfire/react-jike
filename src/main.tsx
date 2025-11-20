import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
    RouterProvider,
} from "react-router"
import router from "@/router"
import { Layout} from "antd";
import { Content } from 'antd/es/layout/layout'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Layout style={{ minHeight: '100vh' }}>
          <Content style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px'
          }}>
             <RouterProvider router={router}></RouterProvider>
          </Content>
      </Layout>


  </StrictMode>,
)
