import React, { useState } from "react";
import {apiUrl} from "./utils";

export default async function loginUser(user) {
    const res = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: `${user.id}`, password: `${user.password}` })
    });

    const body = await res.json();
    if (body.Error) {
        // console.log(res.Message)
        throw Error(`${body.Message}`);
    }
    return body;
}
