import React, {useEffect, useState} from 'react';
import {getAll} from "../api/users";
import Table from "../components/Table";
import {useLocation, useNavigate} from "react-router-dom";
import {ErrorAlert} from "../components/Alerts";
import {clearState} from "../utils";
import {Button} from "reactstrap";

const UserPage = () => {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {state} = useLocation();

    useEffect(() => {
        if (state != null && state.error != null) {
            setError(state.error);
            clearState();
        }

        getAll()
            .then(usersData => {
                setUsers(usersData);
            })
            .catch(err => {
                setError(err);
            });
    }, []);

    const handleUserSelect = (params) => {
        const user = params.data;
        navigate('/users/' + user.userID, {state: {type: 'UPDATE', selectedUser: user}});
    };

    const handleCreateUser = () => {
        navigate('/users/create', {state: {type: 'CREATE'}});
    }

    const columns = [
        {headerName: "ID", field: "userID"},
        {headerName: "First Name", field: "firstName"},
        {headerName: "Last Name", field: "lastName"},
        {headerName: "Role", valueGetter: params => params.data.userRole === 'Locomotive' ? 'Locomotive Driver' : params.data.userRole},
        {headerName: 'Status', colId: 'status', valueGetter: params => params.data.active ? 'Active' : 'Archived'}
    ];

    const onGridReady = (e) => {
        e.api.setFilterModel({
            status: {
                filterType: 'text',
                type: 'contains',
                filter: 'Active'
            }
        })
    }

    return (
        <div className="container-fluid">
            <div className="col">
                <section className="metric">
                    <div className="hero__content">
                        <div className="table-wrapper">
                            <div className="table-header-wrapper">
                                <h4 className="table-header">Users</h4>
                            </div>
                            <div className="row">
                                {error && <ErrorAlert message={error}/>}
                                {users ? <Table columns={columns} data={users} onRowClicked={handleUserSelect} onGridReadyCallback={onGridReady}/> : null}
                            </div>
                        </div>
                    </div>
                </section>

                <Button color="primary" className="w-100" style={{marginTop: '20px'}} onClick={handleCreateUser}>
                    Create User
                </Button>
            </div>
        </div>
    );
};

export default UserPage;