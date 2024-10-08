import ReactDOM from 'react-dom/client'
import './index.css'
import { useState, useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'
import universalReducer from './slices/UniversalState.js'
import authReducer from './slices/AuthState.js'
import MainTheme from './themes/MainTheme.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Layout.jsx'
import Version from './pages/Version.jsx'
import Health from './pages/Health.jsx'
import ExpandedListingHost from './pages/orders/ExpandedListingHost.jsx'
import FoodListingsPage from './pages/Listings/FoodListingsPage'
import CreateAccount from './pages/identity/CreateAccount'
import Login from './pages/identity/Login'
import EmailVerification from './pages/identity/EmailVerification';
import AccountRecovery from './pages/identity/AccountRecovery';
import Reviews from './pages/reviews/Reviews.jsx'
import NotFound from './pages/404.jsx'
import Chat from './pages/chat/Chat.jsx'
import MyAccount from './pages/identity/MyAccount.jsx'
import ExpandedListingGuest from './pages/orders/ExpandedListingGuest.jsx'
import VerifyToken from './pages/identity/VerifyToken.jsx';
import AuthLayout from './AuthLayout.jsx';
import GoogleMapsPage from './pages/Listings/GoogleMapsPage'
import Schedule from "./pages/identity/Schedule"
import MakanHistory from './pages/identity/MakanHistory.jsx';
import Favourites from './pages/identity/Favourites.jsx';
import MakanReviews from './pages/identity/MakanReviews.jsx';
import ConfirmReservation from './pages/orders/ConfirmReservation.jsx';
import CustomerSupport from './pages/customerSupport/CustomerSupport.jsx';
import MakanBot from './pages/customerSupport/MakanBot.jsx';
import AdminHomepage from './pages/identity/Admin/AdminHomepage.jsx';
import HygieneReports from './pages/identity/Admin/HygieneReports.jsx';
import UserManagement from './pages/identity/Admin/UserManagement.jsx';
import AdminAccount from './pages/identity/Admin/AdminAccount.jsx';
import UpcomingReservation from './pages/orders/UpcomingReservation.jsx';
import ChargeableCancellation from './pages/orders/ChargeableCancellation.jsx';
import PublicGuestProfile from './pages/identity/PublicGuestProfile.jsx';
import MyListings from './pages/Listings/MyListings.jsx'

const store = configureStore({
    reducer: {
        universal: universalReducer,
        auth: authReducer
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <ChakraProvider theme={MainTheme} toastOptions={{ defaultOptions: { position: 'bottom-right' } }}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<FoodListingsPage />} />
                        <Route path={'health'} element={<Health />} />
                        <Route path={'version'} element={<Version />} />
                        <Route path={"expandedListingHost"} element={<ExpandedListingHost />} />
                        <Route path={"expandedListingGuest"} element={<ExpandedListingGuest />} />
                        <Route path={'reviews'} element={<Reviews />} />
                        <Route path={'chat'} element={<Chat />} />
                        <Route path={"targetListing"} element={<GoogleMapsPage/>} />
                        <Route path={"guestInfo"} element={<PublicGuestProfile />} />
                        <Route path={"myListings"} element={<MyListings />} />
                        <Route path={"reservations"}>
                            <Route path={"new"} element={<ConfirmReservation />} />
                            <Route path={"upcoming"} element={<UpcomingReservation />} />
                            <Route path={"chargeableCancel"} element={<ChargeableCancellation />} />
                        </Route>
                        <Route path='admin'>
                            <Route index element={<AdminHomepage />} />
                            <Route path={"hygieneReports"} element={<HygieneReports />} />
                            <Route path={"userManagement"} element={<UserManagement />} />
                            <Route path={"myAccount"} element={<AdminAccount />} />
                        </Route>
                        <Route path={"customerSupport"} element={<CustomerSupport />} />
                        <Route path={"makanBot"} element={<MakanBot />} />
                        <Route path='*' element={<NotFound />} />
                    </Route>
                    <Route path='/auth' element={<AuthLayout />}>
                        <Route path={"createAccount"} element={<CreateAccount />} />
                        <Route path={"login"} element={<Login />} />
                        <Route path={"emailVerification"} element={<EmailVerification />} />
                        <Route path={"accountRecovery"} element={<AccountRecovery />} />
                        <Route path={"verifyToken"} element={<VerifyToken />} />
                        <Route path='*' element={<NotFound />} />
                    </Route>
                    <Route path='/identity' element={<Layout />}>
                        <Route path={"myAccount"} element={<MyAccount />} />
                        <Route path={"makanHistory"} element={<MakanHistory />} />
                        <Route path={"favourites"} element={<Favourites />} />
                        <Route path={"makanReviews"} element={<MakanReviews />} />
                        <Route path={"schedule"} element={<Schedule />} />
                        <Route path='*' element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </Provider>
)