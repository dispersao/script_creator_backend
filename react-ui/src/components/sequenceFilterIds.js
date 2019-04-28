import React from 'react'
import Select from 'react-select'

const SequenceFilterIds = ({filter, items, onChangeIds}) => {
  return (
      <Select
       isMulti = 'true'
       value={idsToOption(items, filter.ids)}
       onChange={els => onChangeIds(els.map(el => el.value))}
       options={itemsToOptions(items)}
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

const itemsToOptions = (items) => {
  if(items && Object.keys(items).length){
    return Object.keys(items).map(key => itemToOption(items[key]))
  }
}

const itemToOption = (item) => ({
  label: item.name,
  value: item.id
})
