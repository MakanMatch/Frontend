import ReactDOM from 'react-dom/client'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import universalReducer from './slices/UniversalState.js'
import MainTheme from './themes/MainTheme.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import Version from './pages/Version.jsx'
import Home from './pages/Home.jsx'
import ExpandedListingHost from './pages/orders/ExpandedListingHost.jsx'
import FoodListingsPage from './pages/Listings/FoodListingsPage'
import CreateAccount from './pages/identity/CreateAccount'
import Login from './pages/identity/Login'
import EmailVerification from './pages/identity/EmailVerification';
import AccountRecovery from './pages/identity/AccountRecovery';
import Reviews from './pages/reviews/Reviews.jsx'
import NotFound from './pages/404.jsx'
import ExpandedListingGuest from './pages/orders/ExpandedListingGuest.jsx'

const store = configureStore({
    reducer: {
        universal: universalReducer,
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ChakraProvider theme={MainTheme} toastOptions={{ defaultOptions: { position: 'bottom-right' }}}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<FoodListingsPage />} />
                        <Route path={'version'} element={<Version />} />
                        <Route path={"expandedListing"} element={<ExpandedListingHost />} />
                        <Route path={"expandedListingGuest"} element={<ExpandedListingGuest />} />
                        <Route path={"/createAccount"} element={<CreateAccount />} />
                        <Route path={"/login"} element={<Login />} />
                        <Route path={"/emailVerification"} element={<EmailVerification />} />
                        <Route path={"/accountRecovery"} element={<AccountRecovery />} />
                        <Route path='reviews' element={<Reviews />} />
                        <Route path='*' element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>
)