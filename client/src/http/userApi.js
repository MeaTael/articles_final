import React from 'react';
import {$host, $authHost} from "./index";
import {jwtDecode} from "jwt-decode";

export const registration = async (username, password) => {
    const {data} = await $host.post('api/user/registration', {username, password})
    localStorage.setItem('token', data)
    return jwtDecode(data)
}

export const logIn = async (username, password) => {
    const {data} = await $host.post('api/user/login', {username, password})
    localStorage.setItem('token', data)
    return jwtDecode(data)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data)
    return jwtDecode(data)
}