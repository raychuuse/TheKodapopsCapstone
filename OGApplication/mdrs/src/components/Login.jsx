import React, {useState} from "react";
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import {ErrorAlert} from "./Alerts";
import LoadingSpinner from "./LoadingSpinner";
import loginUser from "../api/loginUser";
import {useAuth} from "../AuthProvider";


// function hasKey(obj, key, value) {
//     return obj.hasOwnProperty(key) && obj[key] == value;
// }

// function checkLoginDetails(id, password) {
//     var testID = "test"
//     var testPW = "123"

//     const loginAttempt = {
//         id: password
//     }

//     //returns true if loginAttempt contains same data as test examples (need SQL DATA)
//     hasKey(loginAttempt, testID, testPW)
// }

export function LoginForm() {
    const [id, setId] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const auth = useAuth();

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        auth.loginAction({id: id, password: password});
    }

    return (
        <main>
            <div className="login-wrapper">
                <h1>Please Log In</h1>

                {/* {message ? SuccessAlert(message) : null} */}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="id" hidden>Email</Label>
                        <Input id="id" name="id" placeholder="ID" type="id"
                               onChange={e => {setId(e.target.value);}}
                        />
                    </FormGroup>
                    {' '}
                    <FormGroup>
                        <Label for="password" hidden>Password</Label>
                        <Input id="password" name="password" placeholder="Password" type="password"
                            onChange={e => {setPassword(e.target.value)}}
                        />
                    </FormGroup>
                    {error && <ErrorAlert message={error.message}/>}

                    {/* <Button type="submit">Submit</Button> */}
                    <Button type="submit" disabled={loading}>{loading ?
                        <LoadingSpinner/> : 'Submit'}</Button> {/* shows loading spinner if loading state is true */}
                </Form>
            </div>
        </main>
    );
}
