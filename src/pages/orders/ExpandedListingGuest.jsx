import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function ExpandedListingGuest() {
    const navigate = useNavigate()

    const backendAPIURL = import.meta.env.VITE_BACKEND_URL
    const [searchParams, setSearchParams] = useSearchParams()
    const [listingData, setListingData] = useState({
        listingID: null,
        title: null,
        images: [],
        shortDescription: null,
        longDescription: null,
        portionPrice: null,
        approxAddress: null,
        address: null,
        totalSlots: null,
        datetime: null,
        published: null
    })
    const [hostData, setHostData] = useState({
        userID: null,
        username: null,
        foodRating: 0.0,
        hygieneGrade: 0.0
    })

    

    return (
        <div>ExpandedListingGuest</div>
    )
}

export default ExpandedListingGuest