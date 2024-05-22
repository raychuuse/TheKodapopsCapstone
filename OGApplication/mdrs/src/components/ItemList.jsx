import React, {useEffect, useState} from "react";
import {List, Search} from "./Search";
import LoadingSpinner from "./LoadingSpinner";
import {ErrorAlert, SuccessAlert} from "./Alerts";
import {Input} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {standardiseData} from "../utils";

{/* Search Bar
    get the list of items from the database
    map that list of items to the list group buttons
    make the id of the button the name from the database
    then the onClick event is what will send that id
    to fetch the details of specific item from the database
    and then populate the datatable
*/
}
const ItemList = ({onItemSelected, itemName, getAllItemApi, createItemApi, updateItemApi, deleteItemApi}) => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [state, setState] = useState('CREATE')
    const [formInput, setFormInput] = useState('');
    const [formTitle, setFormTitle] = useState('Create New ' + itemName);
    const [formButtonText, setFormButtonText] = useState('Create ' + itemName);
    const [formButtonStyle, setFormButtonStyle] = useState('btn-primary')
    const [formSelectedId, setFormSelectedId] = useState(-1);

    useEffect(() => {
        fetchItems()
    }, []);

    const fetchItems = () => {
        getAllItemApi()
            .then(data => {
                console.info(data);
                const temp = standardiseData(data);
                console.info(temp);
                setAllItems(temp)
                setSelectedItem(temp)
                setLoading(false)
            })
            .catch(err => {
                setError(err)
                setSelectedItem(null)
                setAllItems(null)
                setLoading(false)
            });
        setFormInput('');
        setState('CREATE');
    };

    const updateSearch = (itemId) => {
        onItemSelected(itemId);
    }

    const updateKeyword = (keyword) => {
        const filtered = allItems.filter((obj) => obj.name.toLowerCase().includes(keyword.toLowerCase()));
        setKeyword(keyword);
        setSelectedItem(filtered);
    };

    const getItemFromSelectedID = (selectedID) => {
        return allItems.find(i => i.id === selectedID);
    };

    const onEditItem = (itemId) => {
        for (const item of selectedItem) {
            if (item.id === itemId) {
                setState('EDIT');
                setFormTitle(`Update ${itemName}'s Name`);
                console.info(formInput, item, item.name);
                setFormInput(item.name);
                console.info(formInput);
                setFormButtonText("Update " + itemName);
                setFormButtonStyle('btn-primary');
                setFormSelectedId(itemId);
            }
        }
    }

    const onDeleteItem = (itemId) => {
        for (const item of selectedItem) {
            if (itemId === item.id) {
                setState('DELETE');
                setFormTitle("Delete " + itemName);
                setFormInput(item.name);
                setFormButtonText("Confirm Delete");
                setFormButtonStyle('btn-danger');
                setFormSelectedId(itemId);
            }
        }
    }

    const updateItemName = (event) => {
        setFormInput(event.target.value);
    };

    const setStateCreate = () => {
        setState('CREATE');
        setFormTitle('Create New ' + itemName);
        setFormButtonText("Create " + itemName);
        setFormInput('');
        setFormButtonStyle('btn-primary');
    }

    const onFormButtonClick = () => {
        if ((state === 'CREATE' || state === 'EDIT') && formInput === '') {
            setError({message: "Please enter a name to submit"})
            return;
        }
        setError(null);

        if (state === 'CREATE') {
            createItemApi(formInput).then(response => {
                fetchItems();
                setSuccess({message: itemName + ' Successfully Created'});
                setInterval(() => setSuccess(null), 2500);
                setStateCreate();
            }).catch(err => {
                console.error(err);
                setError(err);
            });
        } else if (state === 'EDIT') {
            const item = getItemFromSelectedID(formSelectedId);
            if (item?.name === formInput) {
                console.info('yeooting');
                return;
            }
            updateItemApi(formSelectedId, formInput).then(result => {
                fetchItems();
                setSuccess({message: itemName + ' Successfully Updated'});
                setInterval(() => setSuccess(null), 2500);
                navigate(`?id=${formSelectedId}`);
                setStateCreate();
            }).catch(error => {
                setError(error);
            });
        } else {
            deleteItemApi(formSelectedId).then(result => {
                fetchItems();
                setSuccess({message: itemName + ' Successfully Deleted'});
                setInterval(() => setSuccess(null), 2500);
                setStateCreate();
            }).catch(error => {
                setError(error);
            });
        }
    };

    return <section className="search" style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
        <div className="search-header-wrapper">
            <h2 className="search-header">
                {itemName}s
            </h2>
            <hr />
        </div>
        <div className="search-bar-wrapper">
            <Search keyword={keyword} onChange={updateKeyword} />
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error.message !== "" ? error.message : "Error in input."} />}
            {success && <SuccessAlert message={success.message} />}
        </div>
        <div className="list-wrapper" style={{ flex: 1, overflowY: 'auto' }}>
            {!loading /**  && !error */ && (
                <List
                    data={selectedItem}
                    onClick={updateSearch}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    loading={loading}
                />
            )}
        </div>
        <div className="form-wrapper">
            <button style={{display: state === 'CREATE' ? 'none' : 'block'}}
                    className={`w-100 btn-md btn btn-primary mt-1`} onClick={setStateCreate}>Create Siding
            </button>
            <hr/>
            <h3>{formTitle}</h3>
            <Input type="text" value={formInput} onChange={updateItemName} classname={'list-group-item'}/>
            <button
                style={{marginTop: '1rem'}}
                className={`w-100 btn-md btn mb-3 ${formButtonStyle}`}
                onClick={onFormButtonClick}
            >
                {formButtonText}
            </button>
        </div>
    </section>
}

export default ItemList;