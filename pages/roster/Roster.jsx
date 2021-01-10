/* eslint-disable @next/next/no-img-element */
import React, {useState, useEffect, useRef } from 'react'
import styles from './Roster.module.scss'
import Division from '../divisions/Division'

//primereact
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';

const Roster = (props) => {

  let emptyPlayer = {
    id: '',
    name: '',
    dob: '',
    jersey: 0,
    status: ''
  };

  const [players, setPlayers] = useState(null);
  const [playerDialog, setPlayerDialog] = useState(false);
  const [deletePlayerDialog, setDeletePlayerDialog] = useState(false);
  const [updatePlayerDialog, setUpdatePlayerDialog] = useState(false);
  const [deletePlayersDialog, setDeletePlayersDialog] = useState(false);
  const [player, setPlayer] = useState(emptyPlayer);
  const [selectedPlayers, setSelectedPlayers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [display, setDisplay] = useState(false)
  const toast = useRef(null);
  const dt = useRef(null);

  const statuses = [
    {label: 'Playing', value: 'Playing'},
    {label: 'Not Playing', value: 'Not Playing'},
  ]

  const monthNavigatorTemplate = (e) => {
    return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
  }

  const yearNavigatorTemplate = (e) => {
    return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
  }


  const rosterLoader = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);

    const raw = JSON.stringify({
        "operation": "sql",
        "sql": `SELECT * FROM roster.${props.division}roster`
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    
    fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
      .then(response => response.text())
      .then(result => setPlayers(JSON.parse(result)))
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    rosterLoader();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removePlayerRoster = async (player) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);

    var raw = JSON.stringify({
      "operation": "delete",
      "schema": "roster",
      "table": `${props.division}roster`,
      "hash_values": [
        player
      ]
  });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    
    fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
      .then(response => response.text())
      .then(result => console.log('result', result))
      .catch(error => console.log('error', error));
  }

  const addPlayerRoster = async (player) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);
    console.log(`${player.name},${player.dob},${player.jersey},${player.status}`)

    var raw = JSON.stringify({
      "operation": "insert",
      "schema": "roster",
      "table": `${props.division}roster`,
      "records": [
          {
              "dob": `${player.dob}`,
              "name": `${player.name}`,
              "jersey": `${player.jersey}`,
              "status": `${player.status}`
          },
      ]
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    
    fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result, result))
      .catch(error => console.log('error', error));
  }

  const updatePlayerRoster = async (player) => {
    console.log(player)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);

    console.log(`${player.name},${player.dob},${player.jersey},${player.status}`)

    var raw = JSON.stringify({
      "operation": "update",
      "schema": "roster",
      "table": `${props.division}roster`,
      "records": [
        {
            "id": `${player.id}`,
            "dob": `${player.dob}`,
            "name": `${player.name}`,
            "jersey": `${player.jersey}`,
            "status": `${player.status}`
        },
    ]
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    
    fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result, result))
      .catch(error => console.log('error', error));
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < players.length; i++) {
        if (players[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  const openNew = () => {
      setPlayer(emptyPlayer);
      setSubmitted(false);
      setPlayerDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setPlayerDialog(false);
  }

  const hideUpdateDialog = () => {
    setSubmitted(false);
    setUpdatePlayerDialog(false);
  }

  const hideDeletePlayerDialog = () => {
    setDeletePlayerDialog(false);
  }

  const hideDeletePlayersDialog = () => {
    setDeletePlayersDialog(false);
  }

  const savePlayer = () => {
    setSubmitted(true);

    if (player.name.trim()) {
      let _players = [...players];
      let _player = {...player};
      if (player.id) {
        const index = findIndexById(player.id);
        _players[index] = _player;
        console.log(_player)
        updatePlayerRoster(_player);
        setUpdatePlayerDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'player Updated', life: 3000 });
      }
      else {
        _players.push(_player);
        addPlayerRoster(_player);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'player Created', life: 3000 });
      }
      setPlayers(_players);
      setPlayerDialog(false);
      setPlayer(emptyPlayer);
    }
  }
  const editPlayer = (player) => {
    setPlayer({...player});
    setUpdatePlayerDialog(true);
  }

  const confirmDeletePlayer = (player) => {
    setPlayer(player);
    setDeletePlayersDialog(true);
  }

  const deletePlayer = () => {
    let toDel = player.id
    let _players = players.filter(val => val.id !== player.id);
    removePlayerRoster(toDel)
    setPlayer(_players);
    setDeletePlayersDialog(false);
    setPlayer(emptyPlayer);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'player Deleted', life: 3000 });
  }

  const exportCSV = () => {
    dt.current.exportCSV();
  }

  const confirmDeleteSelected = () => {
    setDeletePlayersDialog(true);
  }

  const deleteSelectedPlayers = () => {
    let _players = players.filter(val => !selectedPlayers.includes(val));
    console.log(selectedPlayers)
    let plDel = []
    selectedPlayers.map(val => {
        plDel.push(val.id)
    })
    console.log(plDel)
    plDel.forEach((player) => {
      removePlayerRoster(player)
    });
    setPlayers(_players);
    setDeletePlayersDialog(false);
    setSelectedPlayers(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'events Deleted', life: 3000 });
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _player = {...player};
    _player[`${name}`] = val;
    setPlayer(_player);
  }

  const onDateChange = (e, dob) => {
    const val = (e.target && e.target.value) || '';
    let _player = {...player};
    _player[`${dob}`] = val.toISOString().substring(0, 10);;
    setPlayer(_player);
  }

  const onInputNumberChange = (e, jersey) => {
    const val = e.value || 0;
    let _player = {...player};
    _player[`${jersey}`] = val;
    setPlayer(_player);
  }

  const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedPlayers || !selectedPlayers.length} />
        </React.Fragment>
    )
  }

  const rightToolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
        </React.Fragment>
    )
  }

  const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editPlayer(rowData)} />
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePlayer(rowData)} /> */}
        </React.Fragment>
    );
  }

  const header = (
    <div className="tableHeader">
        <h5 className="p-m-0">Manage Players</h5>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
  );
  const playerDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePlayer} />
    </React.Fragment>
  );
  const updatePlayerDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideUpdateDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePlayer} />
    </React.Fragment>
  );
  const deletePlayerDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePlayerDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPlayers} />
    </React.Fragment>
  );
  const deletePlayersDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePlayersDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPlayers} />
    </React.Fragment>
  );

  return (
  <>
   { display ? <Division division={props.division}/> : players === 'undefined' ? <div>...Loading</div> : 
    <div className={styles.container}>
      <h2>Roster for {props.division}</h2>
      <p className={styles.p}>
        <Button onClick={() => setDisplay(true)}>Back</Button>
      </p>
        <div className={styles.datatableCrudDemo}>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={players} selection={selectedPlayers} onSelectionChange={(e) => setSelectedPlayers(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} players"
                    globalFilter={globalFilter}
                    header={header}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="name" header="Name" sortable></Column>
                    <Column field="dob" header="Date of Birth" sortable></Column>
                    <Column field="jersey" header="Jersey #" sortable></Column>
                    <Column field="status" header="Status" sortable></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={playerDialog} style={{ width: '450px' }} header="Player Details" modal className="p-fluid" footer={playerDialogFooter} onHide={hideDialog}>
              <div className="p-field">
                  <label htmlFor="name">Name</label>
                  <InputText id="name" value={player.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !player.name })} />
                  {submitted && !player.name && <small className="p-error">Name is required.</small>}
              </div>
              <div className="p-field p-col-12 p-md-4">
                  <label htmlFor="dob">Date of Birth</label>
                  <Calendar id="dob" value={player.dob} onChange={(e) => onDateChange(e, 'dob')} monthNavigator yearNavigator yearRange="2000:2030"
                      monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
              </div>
              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                    <label htmlFor="jersey">Jersey #</label>
                    <InputNumber id="price" value={player.jersey} onValueChange={(e) => onInputNumberChange(e, 'jersey')} integeronly/>
                </div>
                <div className="p-field p-col">
                    <label htmlFor="status">Status</label>
                    <Dropdown id="status" value={player.status} options={statuses} onChange={(e) => onInputChange(e, 'status')}              placeholder="Select a Status"/>
                </div>
              </div>
            </Dialog>

            <Dialog visible={updatePlayerDialog} style={{ width: '450px' }} header="Player Details" modal className="p-fluid" footer={updatePlayerDialogFooter} onHide={hideUpdateDialog}>
              <div className="p-field">
                  <label htmlFor="name">Name</label>
                  <InputText id="name" value={player.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !player.name })} />
                  {submitted && !player.name && <small className="p-error">Name is required.</small>}
              </div>
              <div className="p-field p-col-12 p-md-4">
                  <label htmlFor="dob">Date of Birth</label>
                  <Calendar id="dob" value={player.dob} onChange={(e) => onDateChange(e, 'dob')} monthNavigator yearNavigator yearRange="2000:2030"
                      monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
              </div>
              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                    <label htmlFor="jersey">Jersey #</label>
                    <InputNumber id="price" value={player.jersey} onValueChange={(e) => onInputNumberChange(e, 'jersey')} integeronly/>
                </div>
                <div className="p-field p-col">
                    <label htmlFor="status">Status</label>
                    <Dropdown id="status" value={player.status} options={statuses} onChange={(e) => onInputChange(e, 'status')}              placeholder="Select a Status"/>
                </div>
              </div>
            </Dialog>

            <Dialog visible={deletePlayerDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePlayerDialogFooter} onHide={hideDeletePlayerDialog}>
                <div className="confirmationContent">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {player && <span>Are you sure you want to delete <b>{player.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deletePlayersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePlayersDialogFooter} onHide={hideDeletePlayersDialog}>
                <div className="confirmationContent">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {event && <span>Are you sure you want to delete the selected Player(s)?</span>}
                </div>
            </Dialog>
        </div>
      </div>
   }
  </>
  )
}

export default Roster