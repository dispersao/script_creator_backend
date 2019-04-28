import React from 'react';

const Part = ({type, name, characters, extra, content}) => {
  let partHeader = '';
  if(type === 'dialogue'){
    partHeader += characters[0].name
  }
  if(extra){
    partHeader += ` ${extra}`
  }

  let classes = "partContent";
  if(type === 'observation'){
    classes += " light";
  }

  return (
    <div className="partContainer">
      {partHeader && partHeader.length > 0 &&
        <div className="partHeader">{partHeader}</div>
      }
      <div className={classes}>{content}</div>
    </div>
  )
}

export default Part
