import React from 'react'
import SequenceFilter from './sequenceFilter'
import SequenceCategoryFilter from './sequenceCategoryFilter'

const SequenceFilters = (props)=>{
  return (
    <section className="FiltersContainer">
      <SequenceFilter name='characters' key={1} sortByField='value'></SequenceFilter>
      <SequenceFilter name='types' key={2} sortByField='value'></SequenceFilter>
      <SequenceFilter name='locations' key={3} sortByField='label'></SequenceFilter>
      <SequenceCategoryFilter name='arc' key={4} sortByField='label'></SequenceCategoryFilter>
      <SequenceCategoryFilter name='pos' key={5} sortByField='label'></SequenceCategoryFilter>
    </section>
  )
}

export default SequenceFilters
