import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
    RouterProvider,
} from "react-router"
// @ts-ignore
import router from "@/router"

// @ts-ignore
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
