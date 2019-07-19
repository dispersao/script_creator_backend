import React from 'react'
import Select from 'react-select'
import sortBy from 'lodash/orderBy'


const SequenceFilterIds = ({filter, items, onChangeIds, sortByField}) => {
  return (
      <Select
       isMulti = 'true'
       value={idsToOption(items, filter.ids)}
       onChange={els => onChangeIds(els.map(el => el.value))}
       options={itemsToOptions(items, sortByField)}
     />
  )
}
export default SequenceFilterIds

const idsToOption = (items, ids) => {
  if(ids && ids.length){
    return ids.map(id => {
      return itemToOption(items[id.toString()])
    })
  }
}

const itemsToOptions = (items, sortByField) => {
  if(items && Object.keys(items).length){
    return sortBy(
      Object.keys(items).map(key => (itemToOption(items[key]))),
      el => sortByField ? (Number.isNaN(Number(el[sortByField])) ? el[sortByField] : Number(el[sortByField])) : el
    )

  }
}

const itemToOption = (item) => ({
  label: item.name,
  value: item.id
})
