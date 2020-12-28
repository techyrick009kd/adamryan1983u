import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '@styles/MainPage.module.scss'
import Division from '@pages/divisions/Division'
import { harperFetch } from '@utils/harperdb';


//primereact components
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import 'primereact/resources/primereact.css';
import { NextPage } from 'next'

interface Props {
  data?: Array<any>;
  item?: any;
}

const MainPage: NextPage<Props> = (props) => {

  useEffect(() => {
    // setData(harperFetch(division))
  },[])

  const [ division, setDivision ] = useState()
  const [ page, setPage ] = useState(false)
  // const [data, setData] = useState([])

  const printer = (e: any) => {
    e.preventDefault();
    setPage(true)
  }

  // MainPage.getInitialProps = async () => {
  //   const res = await harperFetch('timbits')
  //   // const json = await res.json()
  //   console.log(res.json())
  //   // return { data: res }
  // }

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
    { page ? <Division division={division} /> :
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
            {/* <ul>
              {[data].map(item => <li key={item.id}>{item.name}</li>)}
            </ul> */}

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