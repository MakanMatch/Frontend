import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import universalReducer from './slices/UniversalState.js'
import MainTheme from './themes/MainTheme.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CreateAccount from './pages/identity/CreateAccount'
import Login from './pages/identity/Login'
import EmailVerification from './pages/identity/EmailVerification';
import AccountRecovery from './pages/identity/AccountRecovery';
import Layout from './Layout.jsx'

const store = configureStore({
    reducer: {
        universal: universalReducer,
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ChakraProvider theme={MainTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path={"/createaccount"} element={<CreateAccount />} />
                        <Route path={"/login"} element={<Login />} />
                        <Route path={"/emailverification"} element={<EmailVerification />} />
                        <Route path={"/accountrecovery"} element={<AccountRecovery />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>
)