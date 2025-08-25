import React from "react";
import { useState,useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
const Dashboard = () => {
  const {user} = useAuth();
  
    return (
        <div>
            <h1>Welcome {user?.firstName} {user?.lastName} 👋</h1>
            <p>Your tasks will be listed here.</p>
        </div>
    );
};

export default Dashboard;
