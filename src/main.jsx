import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import universalReducer from './slices/UniversalState.js'
import MainTheme from './themes/MainTheme.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import Version from './pages/Version.jsx'
import Home from './pages/Home.jsx'

const store = configureStore({
    reducer: {
        universal: universalReducer
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ChakraProvider theme={MainTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path='version' element={<Version />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>
)
