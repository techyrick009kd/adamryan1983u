import React, {useState} from 'react'
import styles from './Division.module.scss'
import Roster from '../roster/Roster'
import Schedule from '../schedule/Schedule'
import MainPage from '@pages/MainPage'

//primereact
import { Button } from 'primereact/button';

const Division = (props: any) => {

  const [choice, setChoice] = useState(0)
    {
      switch (choice) {
        case 1:
          return <Roster division={props.division} />;
        case 2:
          return <Schedule division={props.division} />;
        case 3:
          return <MainPage />;
        default:
          return (
            <div className={styles.container}>
              <div className={styles.title}>
                {props.division} Division
              </div>
              <div className={styles.content}>
                <div className={styles.option}>
                  Select an option:
                </div>
                <div className={styles.buttons}>
                  <p className={styles.p}><Button className={styles.choicebutton} onClick={() => setChoice(1)}>Roster</Button></p>
                  <p className={styles.p}><Button className={styles.choicebutton} onClick={() => setChoice(2)}>Schedule</Button></p>
                </div>
              </div>
              <p className={styles.p}><Button onClick={() => setChoice(3)}>Back</Button></p>
            </div>
        );
      }
    }
}

export default Division
