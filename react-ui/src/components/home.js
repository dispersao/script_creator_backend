import React from 'react'
import ScriptList from './scriptList'
import NewScriptCard from './newScriptCard'
import '../home.css'

const Home = () => {

  return (
    <div className="Home">
      <h1>List of Scripts</h1>
      <NewScriptCard />
      <ScriptList />
    </div>
  )
}

export default Home
