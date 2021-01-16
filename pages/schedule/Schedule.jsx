/* eslint-disable @next/next/no-img-element */
import React, {useState, useEffect, useRef } from 'react'
import Division from '../divisions/Division'
import styles from './Schedule.module.scss'

//primereact
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';

const Schedule = (props) => {

  let emptyEvent = {
    id: null,
    title: '',
    date: '',
    time: '',
    location: '',
    opponent: ''
};

  const [events, setEvents] = useState(null);
  const [eventDialog, setEventDialog] = useState(false);
  const [updateEventDialog, setUpdateEventDialog] = useState(false);
  const [deleteEventDialog, setDeleteEventDialog] = useState(false);
  const [deleteEventsDialog, setDeleteEventsDialog] = useState(false);
  const [event, setEvent] = useState(emptyEvent);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [display, setDisplay] = useState(false)
  const toast = useRef(null);
  const dt = useRef(null);
  const [toDelete, setToDelete] = useState([]);

  const types = [
    {label: 'Exhibition', value: 'Exhibition'},
    {label: 'Make Up Game', value: 'Makeup Game'},
    {label: 'Playoffs', value: 'Playoff'},
  ]

  const scheduleLoader = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);

    const raw = JSON.stringify({
        "operation": "sql",
        "sql": `SELECT * FROM schedule.${props.division}schedule`
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    
    fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
      .then(response => response.text())
      .then(result => setEvents(JSON.parse(result)))
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    scheduleLoader();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeGames = async (game) => {
    console.log(game)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);

    var raw = JSON.stringify({
      "operation": "delete",
      "schema": "schedule",
      "table": `${props.division}schedule`,
      "hash_values": [
        game
      ]
  });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    
    await fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
      .then(response => response.text())
      .then(result => console.log('result', result))
      .catch(error => console.log('error', error));
  }

  const addGame = async (game) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);
    console.log(`${game.date},${game.location},${game.opponent},${game.time},${game.title}`)

    var raw = JSON.stringify({
      "operation": "insert",
      "schema": "schedule",
      "table": `${props.division}schedule`,
      "records": [
          {
              "date": `${game.date}`,
              "location": `${game.location}`,
              "opponent": `${game.opponent}`,
              "time": `${game.time}`,
              "title": `${game.title}`
          },
      ]
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    
    await fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result, result))
      .catch(error => console.log('error', error));
  }

  const updateGame = async (game) => {
    console.log(game)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);
    console.log(`${game.date},${game.location},${game.opponent},${game.time},${game.title}`)

    var raw = JSON.stringify({
      "operation": "update",
      "schema": "schedule",
      "table": `${props.division}schedule`,
      "records": [
          {
              "id": `${game.id}`,
              "date": `${game.date}`,
              "location": `${game.location}`,
              "opponent": `${game.opponent}`,
              "time": `${game.time}`,
              "title": `${game.title}`
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

  const openNew = () => {
      setEvent(emptyEvent);
      setSubmitted(false);
      setEventDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setEventDialog(false);
  }
  const hideUpdateDialog = () => {
    setSubmitted(false);
    setUpdateEventDialog(false);
  }

  const hideDeleteEventDialog = () => {
    setDeleteEventDialog(false);
  }

  const hideDeleteEventsDialog = () => {
    setDeleteEventsDialog(false);
  }

  const saveEvent = () => {
    setSubmitted(true);

    if (event.title.trim()) {
      let _events = [...events];
      let _event = {...event};
      if (event.id) {
        const index = findIndexById(event.id);
        _events[index] = _event;
        updateGame(_event);
        setUpdateEventDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Event Updated', life: 3000 });
      }
      else {
        _event.id = createId();
        _events.push(_event);
        addGame(_event)
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Event Created', life: 3000 });
      }

      //collects all data from form and sends to server
      setEvents(_events);
      setEventDialog(false);
      setEvent(emptyEvent);
    }
  }

  const editEvent = (event) => {
    setEvent({...event});
    setUpdateEventDialog(true);
  }

  const confirmDeleteEvent = (event) => {
    setEvent(event);
    setDeleteEventsDialog(true);
  }

  const updateEvent = () => {
    let toUpdate = event.id
    let _events = events.filter(val => val.id !== event.id);
    updateGame(toUpdate);
    setEvent(_events);
    setUpdateEventDialog(false);
    setEvent(emptyEvent);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'event Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < events.length; i++) {
        if (events[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const exportCSV = () => {
    dt.current.exportCSV();
  }

  const confirmDeleteSelected = () => {
    setDeleteEventsDialog(true);
  }

  const deleteSelectedEvents = () => {
    let _events = events.filter(val => !selectedEvents.includes(val));
    console.log(selectedEvents)
    let evDel = []
    selectedEvents.map(val => {
        evDel.push(val.id)
    })
    console.log(evDel)
    evDel.forEach((game) => {
      removeGames(game)
    });
    setEvents(_events);
    setDeleteEventsDialog(false);
    setSelectedEvents(null);
    setToDelete([]);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'events Deleted', life: 3000 });
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _event = {...event};
    _event[`${name}`] = val;
    setEvent(_event);
  }

  const onDateChange = (e, date) => {
    const val = (e.target && e.target.value) || '';
    let _event = {...event};
    _event[`${date}`] = val.toISOString().substring(0, 10);;
    setEvent(_event);
  }
  const onTimeChange = (e, time) => {
    const val = (e.target && e.target.value) || '';
    let _event = {...event};
    _event[`${time}`] = val
    setEvent(_event);
  }

  const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedEvents || !selectedEvents.length} />
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
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editEvent(rowData)} />
{/*            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteEvent(rowData)} />*/}
        </React.Fragment>
    );
  }

  const header = (
    <div className="tableHeader">
        <h5 className="p-m-0">Manage Events</h5>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
  );
  const eventDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEvent} />
    </React.Fragment>
  );
  const updateEventDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideUpdateDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEvent} />
    </React.Fragment>
  );
  const deleteEventDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEventsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedEvents} />
    </React.Fragment>
  );
  const deleteEventsDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEventsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedEvents} />
    </React.Fragment>
  );


  return (
  <>
   { display ? <Division division={props.division}/> : events === 'undefined' ? <div>...Loading</div> :
    <div className={styles.container}>
      <h2>Schedule for {props.division}</h2>
      <p className={styles.p}>
        <Button onClick={() => setDisplay(true)}>Back</Button>
      </p>
        <div className={styles.datatableCrudDemo}>
            <Toast ref={toast} />
            {events === 'undefined' ? <div>Loading...</div> :
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>


                <DataTable ref={dt} value={events} selection={selectedEvents} onSelectionChange={(e) => setSelectedEvents(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} events"
                    globalFilter={globalFilter}
                    header={header}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="time" header="Time"></Column>
                    <Column field="location" header="Location" sortable></Column>
                    <Column field="opponent" header="Opponent"></Column>
                    <Column field="title" header="Game Type" sortable></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
                
            </div>
            }

            <Dialog visible={eventDialog} style={{ width: '450px' }} header="Event Details" modal className="p-fluid" footer={eventDialogFooter} onHide={hideDialog}>
                <div className="p-field p-col">
                    <label htmlFor="title">Title</label>
                    <Dropdown id="title" value={event.title} options={types} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !event.title })} />
                    {submitted && !event.title && <small className="p-error">Game Type is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="location">Location</label>
                    <InputTextarea id="location" value={event.location} onChange={(e) => onInputChange(e, 'location')} required rows={1} cols={15} />
                </div>
                <div className="p-formgrid p-grid">
                  <div className="p-field p-col">
                      <label htmlFor="opponent">Opponent</label>
                      <InputText id="opponent" value={event.opponent} onChange={(e) => onInputChange(e, 'opponent')} />
                  </div>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <label htmlFor="date">Date of Game</label>
                    <Calendar id="date" value={event.date} onChange={(e) => onDateChange(e, 'date')} showIcon />
                </div>
                <div className="p-field p-col-12 p-md-4">
                  <div className="p-field p-col">
                    <label htmlFor="time">Time of Game</label>
                    <input type="time" id="time" value={event.time} className={styles.timeInput} onChange={(e) => onTimeChange(e, 'time')} />
                  </div>
                </div>
            </Dialog>
            
            <Dialog visible={updateEventDialog} style={{ width: '450px' }} header="Event Details" modal className="p-fluid" footer={updateEventDialogFooter} onHide={hideUpdateDialog}>
                <div className="p-field p-col">
                    <label htmlFor="title">Title</label>
                    <Dropdown id="title" value={event.title} options={types} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !event.title })} />
                    {submitted && !event.title && <small className="p-error">Game Type is required.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="location">Location</label>
                    <InputTextarea id="location" value={event.location} onChange={(e) => onInputChange(e, 'location')} required rows={1} cols={15} />
                </div>
                <div className="p-formgrid p-grid">
                  <div className="p-field p-col">
                      <label htmlFor="opponent">Opponent</label>
                      <InputText id="opponent" value={event.opponent} onChange={(e) => onInputChange(e, 'opponent')} />
                  </div>
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <label htmlFor="date">Date of Game</label>
                    <Calendar id="date" value={event.date} onChange={(e) => onDateChange(e, 'date')} showIcon />
                </div>
                <div className="p-field p-col-12 p-md-4">
                  <div className="p-field p-col">
                    <label htmlFor="time">Time of Game</label>
                    <input type="time" id="time" value={event.time} className={styles.timeInput} onChange={(e) => onTimeChange(e, 'time')} />
                  </div>
                </div>
            </Dialog>

            <Dialog visible={deleteEventDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEventDialogFooter} onHide={hideDeleteEventDialog}>
                <div className="confirmationContent">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {event && <span>Are you sure you want to delete <b>{event.title}</b> on <b>{event.date}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteEventsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEventsDialogFooter} onHide={hideDeleteEventsDialog}>
                <div className="confirmationContent">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {event && <span>Are you sure you want to delete the selected Events?</span>}
                </div>
            </Dialog>
        </div>
        </div>
   }
  </>
  )
}

export default Schedule