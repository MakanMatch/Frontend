import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import universalReducer from './slices/UniversalState.js'
import reviewsReducer from './slices/ReviewsState.js'
import MainTheme from './themes/MainTheme.js'

const store = configureStore({
    reducer: {
        universal: universalReducer,
        reviews: reviewsReducer
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ChakraProvider theme={MainTheme}>
                <App />
            </ChakraProvider>
        </Provider>
    </React.StrictMode>,
)
