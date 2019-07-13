import React from 'react'
import SequenceFilter from './sequenceFilter'
import SequenceCategoryFilter from './sequenceCategoryFilter'

const SequenceFilters = (props)=>{
  return (
    <section className="FiltersContainer">
      <SequenceFilter name='characters' key={1}></SequenceFilter>
      <SequenceFilter name='types' key={2}></SequenceFilter>
      <SequenceFilter name='locations' key={3}></SequenceFilter>
      <SequenceCategoryFilter name='arc' key={4}></SequenceCategoryFilter>
      <SequenceCategoryFilter name='pos' key={5}></SequenceCategoryFilter>
    </section>
  )
}

export default SequenceFilters
