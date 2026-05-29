import {createContext, useState} from "react"

export const AIContext = createContext()

export const AIProvider = ({children}) => {
    const [report, setReport] = useState(null) 
    const [loading, setLoading] = useState(false)
    const [reports, setReports] = useState([])
    return (
        <AIContext.Provider value={{report, setReport, loading, setLoading, reports, setReports}}>
            {children}
        </AIContext.Provider>
    )
}