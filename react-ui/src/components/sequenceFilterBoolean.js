import React from 'react'

const SequenceFilterBoolean = ({filter, field, onChange}) => {
  return (
    <label className="btn btn-default adjusted">
      <input
        type="checkbox"
        name={field} id={field}
        value="true"
        checked ={filter[field]}
        onChange={ev => onChange(ev.currentTarget.checked)}/>
      {field}
    </label>
  )
}
export default SequenceFilterBoolean
