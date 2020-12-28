import React, {useState} from 'react'
import Head from 'next/head'
import styles from '@styles/Login.module.scss'

//prime imports
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import 'primereact/resources/primereact.css';

const Login = (props: any) => {

  const [password,setPassword] = useState();

  const verifyPassword = () => {
    password === process.env.NEXT_PUBLIC_PASSPHRASE ? props.setAuthenticated(true) : props.setAuthenticated(false);
  }

  const handlePassword = (event: any) => {
    setPassword(event.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>BIMHL</title>
        <meta name="description" content="BIMHL Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        Enter the password:
        </h1>
        <p className={styles.p}>
          <InputText type="password" className={styles.password} onChange={handlePassword}/>
        </p>
        <Button className={styles.submitButton} onClick={verifyPassword}>Login</Button>
      </main>
    </div>
  )
}

export default Login
