import React, { useState } from "react";
import {serverUrl} from "./utils";

export default async function loginUser(user) {
    const q = JSON.stringify({ id: `${user.id}`, password: `${user.password}` });
    const res = await fetch(`${serverUrl}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: q
    });

    const body = await res.json();
    if (body.Error) {
        // console.log(res.Message)
        throw Error(`${body.Message}`);
    }
    return body;
}
