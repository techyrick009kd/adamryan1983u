import React, {useState, useEffect} from 'react'
import MainPage from '@pages/MainPage'
import Login from '@pages/Login'

const Home = ( props:any ) => {

  //set back to false later
const [authenticated, setAuthenticated] = useState(false);

  return (
    authenticated === true ? <MainPage isConnected={props.isConnected}/> : <Login authenticated = {authenticated} setAuthenticated={setAuthenticated} />
  )
}

export default Home