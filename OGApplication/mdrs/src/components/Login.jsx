import React, {useState} from "react";
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import {ErrorAlert, SuccessAlert} from "./Alerts";
import LoadingSpinner from "./LoadingSpinner";
import users, {login, resetPassword, resetToken} from "../api/users";
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
    const [inResetCode, setInResetCode] = useState(false);
    const [inResetPassword, setInresetPassword] = useState(false);
    const [codeEmail, setCodeEmail] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [resetPass, setResetPass] = useState('');
    const [resetPassConfirm, setResetPassConfirm] = useState('');
    const [resetCode, setResetCode] = useState(''); 
    const [codeSuccess, setCodeSuccess] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    const emailChecker = (mail) => {
        return mail.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        login({id: id, password: password})
            .then(response => {
                setLoading(false);
                auth.onLogin(response.user, response.token);
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
                setError(err);
            });
    }

    const resetPassSwitch = () => {
        setInResetCode(false);
        setInresetPassword(!inResetPassword);
    }

    const resetCodeSwitch = () => {
        setInResetCode(!inResetCode);
        setInresetPassword(false);
    }

    const handleResetCode = e => {
        setCodeSuccess(false);
        setResetSuccess(false);
        setError(null);
        e.preventDefault();
        setLoading(true);
        if (!codeEmail) {
            setError(new Error("Please provide an email"));
            setLoading(false);
            return;
        }
        if (!emailChecker(codeEmail)) {
            setError(new Error('Please provide a valid email.'));
            setLoading(false);
            return;
        }
        try {
            resetToken({
                email: codeEmail,
                })
            .then(() => {
                setLoading(false);
                setCodeSuccess(true);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
        } 
        catch (err) {
            if (err.message) {
                setError(new Error(err.message));
            }
            else {
                setError(new Error("Server connection issues are occuring"));
            }
            setLoading(false);
        }
    };
    
    const handleReset = e => {
        setError(null);
        e.preventDefault();
        setCodeSuccess(false);
        setResetSuccess(false);
        setLoading(true);
        if (!resetPass || !resetCode || !resetPassConfirm || !resetEmail) {
            setError(new Error('Please provide reset password details required.'));
            setLoading(false);
            return;
        }
        if (resetPass != resetPassConfirm) {
            setError(new Error('Passwords do not match.'));
            setLoading(false);
            return;
        }
        if (!emailChecker(resetEmail)) {
            setError(new Error('Please provide a valid email.'));
            setLoading(false);
            return;
        }
        // Add further logic if desired
        /*
        if (!resetPass.match(`^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$`)){
        generalAlert("Please provide a stronger password (minimum 8 characters, 1 special character, 2 numerals, 3 lower case, 2 upper case).");
        }*/
        try {
            resetPassword({
                email: resetEmail,
                password: resetPass,
                code: resetCode,
                })
            .then(() => {
                setLoading(false);
                setResetSuccess(true);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
        } 
        catch (err) {
            if (err.message) {
                setError(new Error(err.message));
            }
            else {
                setError(new Error("Server connection issues are occuring"));
            }
            setLoading(false);
        }
    };

    const styles = {
        resetbuttons: {
          fontSize: "17px",
          color: "#5eb4ec",
        }
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

                    <Button type="submit" disabled={loading}>{loading ?
                        <LoadingSpinner/> : 'Submit'}</Button> {/* shows loading spinner if loading state is true */}
                </Form>
                {/* Spacing between, just using essentially divs*/}
                <Form> 
                    <FormGroup>
                    </FormGroup>
                    {''}
                    <FormGroup>
                    </FormGroup>
                </Form>
                <div className="reset-wrapper">
                    <div className="Reset-Button">
                        <span onClick={resetCodeSwitch} disabled={loading} style = {styles.resetbuttons}>Forgot Your Password?</span>
                    </div>    
                    {inResetCode && (
                        <Form onSubmit={handleResetCode}>
                            <FormGroup>
                            <Label for="codeEmail" hidden>Email</Label>
                            <Input id="codeEmail" name="codeEmail" placeholder="Enter Email to send code." type="email"
                                onChange={e => {setCodeEmail(e.target.value)}}
                            />
                            {' '}
                            </FormGroup>
                            <Button type="submit" disabled={loading}>{loading ?
                                <LoadingSpinner/> : 'Submit'}</Button> {/* If any load, stall any server requests */}
                        </Form> 
                        )}  
                    <div>
                    <Form name="myform">
                        <a></a>
                        <span onClick={resetPassSwitch} disabled={loading} style = {styles.resetbuttons}>Reset Password with Code</span> 
                    </Form>
                    </div>
                    {inResetPassword && (
                        <Form onSubmit={handleReset}>
                            <FormGroup>
                            <Label for="resetEmail" hidden>Email</Label>
                            <Input id="resetEmail" name="resetEmail" placeholder="Enter Email" type="email"
                                onChange={e => {setResetEmail(e.target.value)}}
                            />
                            </FormGroup>
                            {' '}
                            <FormGroup>
                            <Label for="resetCode" hidden>Reset Token</Label>
                            <Input id="resetCode" name="resetCode" placeholder="Reset Token" type="code"
                                onChange={e => {setResetCode(e.target.value)}}
                            />
                            </FormGroup>
                            {' '}
                            <FormGroup>
                            <Label for="resetPass" hidden>Reset Password</Label>
                            <Input id="resetPass" name="resetPass" placeholder="Reset Password" type="password"
                                onChange={e => {setResetPass(e.target.value)}}
                            />
                            </FormGroup>
                            {' '}
                            <FormGroup>
                            <Label for="resetPassConfirm" hidden>Confirm Password</Label>
                            <Input id="resetPassConfirm" name="resetPassConfirm" placeholder="Confirm Password" type="password"
                                onChange={e => {setResetPassConfirm(e.target.value)}}
                            />
                            </FormGroup>
                            {' '}
                            <Button type="submit" disabled={loading}>{loading ?
                                <LoadingSpinner/> : 'Submit'}</Button> {/* If any load, stall any server requests */}
                        </Form>
                    )}
                    {(codeSuccess || resetSuccess) && <SuccessAlert message={codeSuccess ? "Successfully Sent Code": "Successfully Reset Password"}/>}
                </div>
            </div>
            
        </main>
    );
}
