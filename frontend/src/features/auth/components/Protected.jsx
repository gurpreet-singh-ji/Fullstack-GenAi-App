import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Protected = ({ children }) => {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export  {Protected}