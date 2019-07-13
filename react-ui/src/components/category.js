import React from 'react'

const Category = ({ type, values })=>{

  return (
    <div className="charactersList light">
      {type} : {values.join(' | ')}
    </div>
  )
}

export default Category
