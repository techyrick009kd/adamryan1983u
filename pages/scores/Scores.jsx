/* eslint-disable @next/next/no-img-element */
import React, {useState, useEffect, useRef } from 'react'
import styles from './Scores.module.scss'
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

const Scores = (props) => {

  let emptyScore = {
    id: '',
    Team1Name: '',
    Team2Name: '',
    Team1Score: 0,
    Team2Score: 0,
    date: '',
    division: props.division,
  };

  const [scores, setScores] = useState(null);
  const [scoreDialog, setScoreDialog] = useState(false);
  const [deleteScoreDialog, setDeleteScoreDialog] = useState(false);
  const [updateScoreDialog, setUpdateScoreDialog] = useState(false);
  const [deleteScoresDialog, setDeleteScoresDialog] = useState(false);
  const [score, setScore] = useState(emptyScore);
  const [selectedScores, setSelectedScores] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [display, setDisplay] = useState(false)
  const toast = useRef(null);
  const dt = useRef(null);

  const monthNavigatorTemplate = (e) => {
    return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
  }

  const yearNavigatorTemplate = (e) => {
    return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
  }


  const scoresLoader = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);
    console.log(props.division)
    const raw = JSON.stringify({
        "operation": "sql",
        "sql": `SELECT * FROM scores.scores WHERE division = '${props.division}'`
    });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };
    
    fetch("https://bimhl-adamryan.harperdbcloud.com", requestOptions)
      .then(response => response.text())
      .then(result => setScores(JSON.parse(result)))
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    scoresLoader();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeScore = async (score) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);

    var raw = JSON.stringify({
      "operation": "delete",
      "schema": "scores",
      "table": "scores",
      "hash_values": [
        score
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

  const addScore = async (score) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);

    var raw = JSON.stringify({
      "operation": "insert",
      "schema": "scores",
      "table": "scores",
      "records": [
          {
              "Team1Name": `${score.Team1Name}`,
              "Team2Name": `${score.Team2Name}`,
              "Team1Score": `${score.Team1Score}`,
              "Team2Score": `${score.Team2Score}`,
              "date": `${score.date}`,
              "division": `${props.division}`
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

  const updateScore = async (score) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${process.env.NEXT_PUBLIC_HARPER_HEADER}`);

    var raw = JSON.stringify({
      "operation": "update",
      "schema": "scores",
      "table": "scores",
      "records": [
        {
          "Team1Name": `${score.Team1Name}`,
          "Team2Name": `${score.Team2Name}`,
          "Team1Score": `${score.Team1Score}`,
          "Team2Score": `${score.Team2Score}`,
          "date": `${score.date}`,
          "division": `${props.division}`
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
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  const openNew = () => {
    setScore(emptyScore);
    setSubmitted(false);
    setScoreDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setScoreDialog(false);
  }

  const hideUpdateDialog = () => {
    setSubmitted(false);
    setUpdateScoreDialog(false);
  }

  const hideDeleteScoreDialog = () => {
    setDeleteScoreDialog(false);
  }

  const hideDeleteScoresDialog = () => {
    setDeleteScoresDialog(false);
  }

  const saveScore = () => {
    setSubmitted(true);

    //fix here
    if (score.Team1Name.trim()) {
      let _scores = [...scores];
      let _score = {...score};
      if (score.id) {
        const index = findIndexById(score.id);
        _scores[index] = _score;
        console.log(_score)
        updateScore(_score);
        setUpdateScoreDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'score Updated', life: 3000 });
      }
      else {
        _scores.push(_score);
        addScore(_score);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'score Created', life: 3000 });
      }
      setScores(_scores);
      setScoreDialog(false);
      setScore(emptyScore);
    }
  }
  const editScore = (score) => {
    setScore({...score});
    setUpdateScoreDialog(true);
  }

  const confirmDeleteScore = (score) => {
    setScore(score);
    setDeleteScoresDialog(true);
  }

  const deleteScore = () => {
    let toDel = score.id
    let _scores = scores.filter(val => val.id !== score.id);
    removeScore(toDel)
    setScore(_scores);
    setDeleteScoresDialog(false);
    setScore(emptyScore);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'score Deleted', life: 3000 });
  }

  const exportCSV = () => {
    dt.current.exportCSV();
  }

  const confirmDeleteSelected = () => {
    setDeleteScoresDialog(true);
  }

  const deleteSelectedScores = () => {
    let _scores = scores.filter(val => !selectedScores.includes(val));
    console.log(selectedScores)
    let plDel = []
    selectedScores.map(val => {
        plDel.push(val.id)
    })
    plDel.forEach((score) => {
      removeScore(score)
    });
    setScores(_scores);
    setDeleteScoresDialog(false);
    setSelectedScores(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'events Deleted', life: 3000 });
  }

  const onInputChange = (e, TeamName) => {
    const val = (e.target && e.target.value) || '';
    let _score = {...score};
    _score[`${TeamName}`] = val;
    setScore(_score);
  }

  const onDateChange = (e, date) => {
    const val = (e.target && e.target.value) || '';
    let _score = {...score};
    _score[`${date}`] = val.toISOString().substring(0, 10);;
    setScore(_score);
  }

  const onInputNumberChange = (e, scoreAmt) => {
    const val = e.value || 0;
    let _score = {...score};
    _score[`${scoreAmt}`] = val;
    setScore(_score);
  }

  const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedScores || !selectedScores.length} />
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
            {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editScore(rowData)} /> */}
            {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteScore(rowData)} /> */}
        </React.Fragment>
    );
  }

  const header = (
    <div className="tableHeader">
        <h5 className="p-m-0">Manage Scores</h5>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
  );
  const scoreDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveScore} />
    </React.Fragment>
  );
  const updateScoreDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideUpdateDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveScore} />
    </React.Fragment>
  );
  const deleteScoreDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteScoreDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedScores} />
    </React.Fragment>
  );
  const deleteScoresDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteScoresDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedScores} />
    </React.Fragment>
  );

  return (
  <>
   { display ? <Division division={props.division}/> : scores === 'undefined' ? <div>...Loading</div> : 
    <div className={styles.container}>
      <h2>Scores for {props.division}</h2>
      <p className={styles.p}>
        <Button onClick={() => setDisplay(true)}>Back</Button>
      </p>
        <div className={styles.datatableCrudDemo}>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={scores} selection={selectedScores} onSelectionChange={(e) => setSelectedScores(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} scores"
                    globalFilter={globalFilter}
                    header={header}>

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="Team1Name" header="Team 1 Name" sortable></Column>
                    <Column field="Team1Score" header="Team 1 Score" ></Column>
                    <Column field="Team2Name" header="Team 2 Name" sortable></Column>
                    <Column field="Team2Score" header="Team 2 Score" ></Column>
                    <Column field="date" header="Game Date" sortable></Column>
                    <Column body={actionBodyTemplate}></Column>
                </DataTable>
            </div>

            <Dialog visible={scoreDialog} style={{ width: '450px' }} header="Score Details" modal className="p-fluid" footer={scoreDialogFooter} onHide={hideDialog}>
              <div className="p-field">
                <label htmlFor="name1">Team 1 Name</label>
                <InputText id="name1" value={score.Team1Name} onChange={(e) => onInputChange(e, 'Team1Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !score.Team1Name })} />
                {submitted && !score.Team1Name && <small className="p-error">Name is required.</small>}
              </div>
              <div className="p-field">
                <label htmlFor="score1">Team 1 Score</label>
                <InputNumber id="score1" value={score.Team1Score} onValueChange={(e) => onInputNumberChange(e, 'Team1Score')} integeronly />
                {submitted && !score.Team1Score && <small className="p-error">Score is required.</small>}
              </div>
              <div className="p-field">
                <label htmlFor="name2">Team 2 Name</label>
                <InputText id="name2" value={score.Team2Name} onChange={(e) => onInputChange(e, 'Team2Name')} required className={classNames({ 'p-invalid': submitted && !score.Team2Name })} />
                {submitted && !score.Team1Name && <small className="p-error">Name is required.</small>}
              </div>
              <div className="p-field">
                <label htmlFor="score2">Team 2 Score</label>
                <InputNumber id="score2" value={score.Team2Score} onValueChange={(e) => onInputNumberChange(e, 'Team2Score')} integeronly />
                {submitted && !score.Team2Score && <small className="p-error">Score is required.</small>}
              </div>
              <div className="p-field p-col-12 p-md-4">
                  <label htmlFor="date">Date of Game</label>
                  <Calendar id="date" value={score.date} onChange={(e) => onDateChange(e, 'date')} monthNavigator yearNavigator yearRange="2019:2030"
                      monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
              </div>
              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                    <label htmlFor="division">Division</label>
                    <InputText id="division" value={props.division} readOnly/>
                </div>
              </div>
            </Dialog>

            <Dialog visible={updateScoreDialog} style={{ width: '450px' }} header="Score Details" modal className="p-fluid" footer={updateScoreDialogFooter} onHide={hideUpdateDialog}>
            <div className="p-field">
                <label htmlFor="name1">Team 1 Name</label>
                <InputText id="name1" value={score.Team1Name} onChange={(e) => onInputChange(e, 'Team1Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !score.Team1Name })} />
                {submitted && !score.Team1Name && <small className="p-error">Name is required.</small>}
              </div>
              <div className="p-field">
                <label htmlFor="score1">Team 1 Score</label>
                <InputNumber id="score1" value={score.Team1Score} onValueChange={(e) => onInputNumberChange(e, 'Team1Score')} integeronly />
                {submitted && !score.Team1Score && <small className="p-error">Score is required.</small>}
              </div>
              <div className="p-field">
                <label htmlFor="name2">Team 2 Name</label>
                <InputText id="name" value={score.Team2Name} onChange={(e) => onInputChange(e, 'Team2Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !score.Team2Name })} />
                {submitted && !score.Team1Name && <small className="p-error">Name is required.</small>}
              </div>
              <div className="p-field">
                <label htmlFor="score2">Team 2 Score</label>
                <InputNumber id="score2" value={score.Team2Score} onValueChange={(e) => onInputNumberChange(e, 'Team2Score')} integeronly />
                {submitted && !score.Team2Score && <small className="p-error">Score is required.</small>}
              </div>
              <div className="p-field p-col-12 p-md-4">
                  <label htmlFor="date">Date of Game</label>
                  <Calendar id="date" value={score.date} onChange={(e) => onDateChange(e, 'date')} monthNavigator yearNavigator yearRange="2019:2030"
                      monthNavigatorTemplate={monthNavigatorTemplate} yearNavigatorTemplate={yearNavigatorTemplate} />
              </div>
              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                    <label htmlFor="division">Division</label>
                    <InputText id="division" value={props.division} readOnly/>
                </div>
              </div>
            </Dialog>

            <Dialog visible={deleteScoreDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteScoreDialogFooter} onHide={hideDeleteScoreDialog}>
                <div className="confirmationContent">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {score && <span>Are you sure you want to delete <b>{props.division}&apos</b> game?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteScoresDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteScoresDialogFooter} onHide={hideDeleteScoresDialog}>
                <div className="confirmationContent">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {score && <span>Are you sure you want to delete the selected Score(s)?</span>}
                </div>
            </Dialog>
        </div>
      </div>
   }
  </>
  )
}

export default Scores