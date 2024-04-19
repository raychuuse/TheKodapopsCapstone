import {useMatch, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {resetSuccessAlert} from "../utils";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {create, getById, setActiveStatus, update} from "../api/users";
import {getAllHarvesters} from "../api/harvesters"
import {ErrorAlert, SuccessAlert} from "../components/Alerts";
import {isNumeric} from "validator";


const UserView = () => {
    const navigate = useNavigate();
    const match = useMatch('/users/:segment')

    const [userID, setUserID] = useState();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [active, setActive] = useState();
    const [harvesters, setHarvesters] = useState();
    const [selectedHarvester, setSelectedHarvester] = useState('');
    // [CREATE|UPDATE]
    const [type, setType] = useState('');

    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    useEffect(() => {
        const segment = match.params.segment;
        if (isNumeric(segment)) {
            const segmentId = parseInt(segment);
            setType('UPDATE');
            getUser(segmentId);
            getHarvesters();
        } else if (segment === 'create') {
            setType('CREATE');
            setUserID('Will be set upon creation');
            getHarvesters();
        } else {
            navigate('/users', {state: {message: 'Invalid path. Please try again.'}});
        }
    }, [])

    const getUser = (id) => {
        getById(id)
            .then(user => {
                setUserID(user.userID);
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setRole(user.userRole);
                setActive(user.active);
                setSelectedHarvester(user.harvesterID);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
            });
    }
    const getHarvesters = () => {
        getAllHarvesters()
            .then(response => {
                setHarvesters(response);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
            });
    }

    const handleSetActive = () => {
        if (type !== 'UPDATE' || userID == null || active == null) return;

        setActiveStatus(userID, active ? 0 : 1)
            .then(response => {
                setSuccess('User Successfully Updated');
                resetSuccessAlert(setSuccess);
                setActive(!active);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
            })
    }

    const handleUpdate = () => {
        if (!validateFormData()) return;

        const data = {userID: userID, firstName: firstName, lastName: lastName, role: role, selectedHarvester: selectedHarvester};
        console.info(data);
        update(data)
            .then(response => {
                setSuccess('User Sucecssfully Updated');
                resetSuccessAlert(setSuccess);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
            });
    };

    const handleCreate = () => {
        if (!validateFormData()) return;
        const data = {firstName: firstName, lastName: lastName, role: role, password: password, selectedHarvester: selectedHarvester};
        create(data)
            .then(response => {
                setSuccess('User Sucecssfully Created');
                resetSuccessAlert(setSuccess);
                // For some reason, this doesn't navigate to the new url, just seems to change the URL, so need to
                // do the following state changes.
                navigate('/users/' + response.userID);
                setType('UPDATE');
                setUserID(response.userID);
                getUser(response.userID);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
            })
    }

    const onRoleChange = (e) => {
        const temp = e.target.value;
        setRole(temp);
        if (temp !== 'Harvester') {
            setSelectedHarvester('');
        }
    };

    const validateFormData = () => {
        // Need to use a temp object because setFormErrors doesn't set formErrors immediately.
        const t = {}
        t.firstName = firstName.trim() === '';
        t.lastName = lastName.trim() === '';
        t.role = role == null || role.trim() === '' || role.trim() === 'Choose Role...';
        t.password = type === 'CREATE' && password.trim() === '';
        t.selectedHarvester = role === 'Harvester' && (selectedHarvester == null || selectedHarvester === '');
        // Return true if all formErrors keys are false or formErrors has no keys.
        let ret = true;
        for (const formErrorsKey in t)
            ret &&= !t[formErrorsKey]; // Wow.
        setFormErrors(t);
        return ret;
    }

    return (
        <div className="container-fluid mt-2">
            <h4 className="table-header">{type === 'UPDATE' ? 'Edit User' : 'Create User'}</h4>
            {success && <SuccessAlert message={success}/>}
            {error && <ErrorAlert message={error}/>}
            <Form>
                <div className="row">
                    <div className="col">
                        <FormGroup>
                            <Label for="userID">User ID</Label>
                            <Input type="text" id="userID" value={userID} readOnly
                                   style={type === 'CREATE' ? {fontStyle: 'italic'} : {}}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {formErrors.firstName &&
                                <span className="text-danger">Please enter a valid first name</span>}
                        </FormGroup>
                        {type === 'CREATE' &&
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    type="text"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {formErrors.password &&
                                    <span className="text-danger">Please enter a valid password</span>}
                            </FormGroup>
                        }
                        {type === 'UPDATE' &&
                            <FormGroup>
                                <Label for="statuc">Status</Label>
                                <Input
                                    type="text"
                                    id="status"
                                    value={active ? 'Active' : 'Archived'}
                                    readOnly
                                />
                            </FormGroup>}
                    </div>
                    <div className="col">
                        <FormGroup>
                            <Label for="role">Role</Label>
                            <Input
                                type="select"
                                id="role"
                                value={role}
                                onChange={(e) => onRoleChange(e)}
                            >
                                <option value={""} disabled>Choose Role...</option>
                                <option value="Mill">Mill</option>
                                <option value="Harvester">Harvester</option>
                                <option value="Locomotive">Locomotive</option>
                            </Input>
                            {formErrors.role && <span className="text-danger">Please select a role from the list</span>}
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {formErrors.lastName && <span className="text-danger">Please enter a valid last name</span>}
                        </FormGroup>
                        {role === 'Harvester' && harvesters != undefined &&
                            <FormGroup>
                                <Label for="harvester">Harvester</Label>
                                <Input
                                    type="select"
                                    id="harvester"
                                    value={selectedHarvester}
                                    onChange={(e) => setSelectedHarvester(e.target.value)}
                                >
                                    <option value={''} disabled>Choose Harvester Company...</option>
                                    {harvesters.map((harvester) => {
                                        return <option value={harvester.harvesterID}>{harvester.harvesterName}</option>;
                                    })}
                                </Input>
                                {role === 'Harvester' && formErrors.selectedHarvester &&
                                    <span className="text-danger">Please select a Harvester company from the list</span>}
                            </FormGroup>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Button color="primary" className="w-100" style={{marginTop: '20px'}}
                                onClick={() => type === 'CREATE' ? handleCreate() : handleUpdate()}>
                            {type === 'CREATE' ? 'Create' : 'Update'}
                        </Button>
                    </div>
                    {type === 'UPDATE' && <div className="col">
                        <Button color={active ? 'danger' : 'success'} className="w-100" style={{marginTop: '20px'}}
                                onClick={() => handleSetActive()}>
                            {active ? 'Archive' : 'Activate'}
                        </Button>
                    </div>}
                </div>
            </Form>
        </div>
    );
};

export default UserView;
