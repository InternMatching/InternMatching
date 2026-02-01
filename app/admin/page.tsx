"use client"
import React, { useEffect, useState } from "react"

export default function AdminPage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                if (!base64Url) throw new Error("Invalid token format")
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decodedData = JSON.parse(jsonPayload);
                console.log(decodedData)
                setUser(decodedData);
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
    }, []);

    return (
        <div className="p-8 min-h-screen  ">


            {user ? (
                <div>
                    <p>Admin Dashboard</p>
                    <div>
                        {user.email}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <p className="text-gray-400">
                        No authentication token found. Please log in to see admin details.
                    </p>
                </div>
            )}
        </div>
    )
}