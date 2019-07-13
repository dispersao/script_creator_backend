import React from 'react'
import Category from './category'

const CategoryList = ({categories})=>{

  let cats = {}

  categories.forEach(cat => {
    cats[cat.type] = cats[cat.type] || []
    cats[cat.type].push(cat.text)
})

  return (
    <div className="categories light">
      {Object.keys(cats).map((catType, index)=>(
        <Category key={index} type={catType} values={cats[catType]}></Category>
      ))}
    </div>
  )
}

export default CategoryList
