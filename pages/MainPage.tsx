import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '@styles/MainPage.module.scss'
import Division from '@pages/divisions/Division'


//primereact components
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import 'primereact/resources/primereact.css';
import { NextPage } from 'next'

interface Props {
  data?: Array<any>;
  item?: any;
  isConnected?: boolean;
}

const MainPage: NextPage<Props> = (props) => {

  const [ division, setDivision ] = useState()
  const [ page, setPage ] = useState(false)

  const printer = (e: any) => {
    e.preventDefault();
    setPage(true)
  }

  const handleDivisionChange = (e: any) => {
    setDivision(e.target.value)
  }

  const divisions = [
    {label: 'TimBits', value: 'timbits'},
    {label: 'U9', value: 'u9'},
    {label: 'U11', value: 'u11'},
    {label: 'U13', value: 'u13'},
    {label: 'U15', value: 'u15'},
    {label: 'U18', value: 'u18'}
];
  return (
    <>
    { page ? <Division division={division} isConnected={props.isConnected}/> :
    <form>
      <div className={styles.container}>
        <Head>
          <title>BIMHL</title>
          <meta name="description" content="BIMHA Website" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h2 className={styles.title}>
            <div className={styles.centered}>
              <p>Welcome to the</p>
              <span className={styles.link}>BIMHA</span> Management System
            </div>
          </h2>
          
          <p className={styles.p}>
            Choose the division you want to manage:
          </p>
          Division: 
          <Dropdown 
            value={division} 
            options={divisions} 
            onChange={handleDivisionChange} 
            placeholder="Select a Division"
          />
          <p className={styles.p}>
              <Button onClick={printer} label="Submit"/>
          </p>
        </main>
      </div>
    </form>
}
    </>
  )
}
export default MainPage