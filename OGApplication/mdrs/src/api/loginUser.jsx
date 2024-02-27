import React, { useState } from "react";

export default async function loginUser(user) {
    const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: `${user.id}`, password: `${user.password}` })
    });

    const res = await response.json();
    if (res.Error) {
        // console.log(res.Message)
        throw Error(`${res.Message}`);
    }
    return res;
}
