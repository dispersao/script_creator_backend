import React from 'react'
import SequenceFilter from './sequenceFilter'

const SequenceFilters = (props)=>{
  return (
    <section className="FiltersContainer">
      <SequenceFilter name='characters' key={1}></SequenceFilter>
      <SequenceFilter name='types' key={2}></SequenceFilter>
      <SequenceFilter name='locations' key={3}></SequenceFilter>
    </section>
  )
}

export default SequenceFilters
