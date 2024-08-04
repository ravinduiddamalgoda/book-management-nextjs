'use client';
import {jwtDecode} from 'jwt-decode'
import React from 'react';

const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return !!decoded; // You can add additional checks here if needed
    } catch (error) {
      return false;
    }
  };

  export default isAuthenticated;
  