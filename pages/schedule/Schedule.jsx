/* eslint-disable @next/next/no-img-element */
import React, {useState, useEffect, useRef } from 'react'
import Division from '../divisions/Division'
import styles from './Schedule.module.scss'

//primereact
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScheduleService } from './scheduleService';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
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
const [deleteEventDialog, setDeleteEventDialog] = useState(false);
const [deleteEventsDialog, setDeleteEventsDialog] = useState(false);
const [event, setEvent] = useState(emptyEvent);
const [selectedEvents, setSelectedEvents] = useState(null);
const [submitted, setSubmitted] = useState(false);
const [globalFilter, setGlobalFilter] = useState(null);
const [display, setDisplay] = useState(false)
const [gameTime, setGameTime] = useState('12:00');
const toast = useRef(null);
const dt = useRef(null);
const [file, setFile] = useState(null);

const scheduleService = new ScheduleService();


const types = [
  {label: 'Exhibition', value: 'Exhibition'},
  {label: 'Make Up Game', value: 'Makeup Game'},
  {label: 'Playoffs', value: 'Playoff'},
]

useEffect(() => {
    scheduleService.getEvents(props).then(data => setEvents(data));
}, []); // eslint-disable-line react-hooks/exhaustive-deps

const openNew = () => {
    setEvent(emptyEvent);
    setSubmitted(false);
    setEventDialog(true);
}

const hideDialog = () => {
  setSubmitted(false);
  setEventDialog(false);
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
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Event Updated', life: 3000 });
      }
      else {
          _event.id = createId();
          _events.push(_event);
          toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Event Created', life: 3000 });
      }

      //collects all data from form and sends to server
      setFile(_events);
      setEvents(_events);
      // writeToFile();
      setEventDialog(false);
      setEvent(emptyEvent);
  }
}
const editEvent = (event) => {
  setEvent({...event});
  setEventDialog(true);
}

const confirmDeleteEvent = (event) => {
  setEvent(event);
  setDeleteEventsDialog(true);
}

const deleteEvent = () => {
  let _events = events.filter(val => val.id !== event.id);
  setEvent(_events);
  setFile(_events);
  // writeToFile();
  setDeleteEventDialog(false);
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
  setEvents(_events);
  setFile(_events);
  // writeToFile();
  setDeleteEventsDialog(false);
  setSelectedEvents(null);
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
          <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" />
          <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
      </React.Fragment>
  )
}

const actionBodyTemplate = (rowData) => {
  return (
      <React.Fragment>
          <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editEvent(rowData)} />
          {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteEvent(rowData)} /> */}
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
const deleteEventDialogFooter = (
  <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEventsDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteEvent} />
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
   { display ? <Division division={props.division}/> : 
    <div className={styles.container}>
      Schedule for {props.division}
      <p className={styles.p}>
        <Button onClick={() => setDisplay(true)}>Back</Button>
      </p>
        <div className={styles.datatableCrudDemo}>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={events} selection={selectedEvents} onSelectionChange={(e) => setSelectedEvents(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} events"
                    globalFilter={globalFilter}
                    header={header}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="id" header="Game ID"></Column>
                    <Column field="title" header="Game Type" sortable></Column>
                    <Column field="location" header="Location" sortable></Column>
                    <Column field="opponent" header="Opponent"></Column>
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="time" header="Time"></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

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
