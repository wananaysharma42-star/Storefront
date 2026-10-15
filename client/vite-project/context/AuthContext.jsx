import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axiosCalls/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const verifyCustomer = async () => {
            try {
                const response = await axiosInstance.get('/customers/me');
                setCustomer(response.data.customerData);
            } catch (err) {
                setCustomer(null);
            } finally {
                setLoading(false); 
            }
        };

        verifyCustomer();

    }, []);

    return (
        <AuthContext.Provider value={{ customer, setCustomer, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);