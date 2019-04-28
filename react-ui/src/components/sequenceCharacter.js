import React from 'react'
import {Badge} from 'react-bootstrap'

const Character = ({id, name})=> {
  const charaStyle = (Number(id) -1)%6;
  const styles = ["danger", "secondary", "success", "primary", "warning", "info", "light" , "dark"];
  return <Badge key={id} pill variant={styles[charaStyle]}>{name}</Badge>
}
 export default Character
