import React, {useState, useEffect} from 'react'
import MainPage from '@pages/MainPage'
import Login from '@pages/Login'
import { HarperDBProvider } from 'use-harperdb';

const Home = ( props ) => {

  const token = process.env.NEXT_PUBLIC_HARPER_TOKEN
  //set back to false later
const [authenticated, setAuthenticated] = useState(true);
  return (
    <HarperDBProvider
      url={process.env.NEXT_PUBLIC_HARPER_URL}
      user={process.env.NEXT_PUBLIC_HARPER_USER}
      password={process.env.NEXT_PUBLIC_HARPER_PASSWORD}>
      {/* token={process.env.NEXT_PUBLIC_HARPER_HEADER}> */}
    {authenticated === true ? <MainPage isConnected={props.isConnected}/> : <Login authenticated = {authenticated} setAuthenticated={setAuthenticated} />}
    </HarperDBProvider>
  )
}

export default Home