
const fetch = require('node-fetch');
const isEqual = require('lodash/isEqual');

let oldData = fetch('http://dispersao-scripts-api.herokuapp.com/sequences', {
  method: 'GET',
  headers: {
            'Content-Type': 'application/json',
             'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE1NjIyMzk2NDIsImV4cCI6MTU5Mzc5NzI0MiwiYXVkIjoiaHR0cHM6Ly9kaXNwZXJzYW8tc2NyaXB0cy5oZXJva3UuY29tIiwiaXNzIjoibWFpcmFzYWxhIiwic3ViIjoic2NyaXB0c19sb2ciLCJqdGkiOiJiYjNlNWYyZi1lYTc0LTQ4YWYtYmU4MC1hMDY5ZTRiNDlhZTMifQ.RpToXRIZR8_q41UFbgz3oyzusqDVVhGBe13VlasRE_o',
        },
}).then(response => response.json()); // parses JSON response into native JavaScript objects

let newData = fetch('http://localhost:3030/sequences', {
  method: 'GET',
  headers: {
            'Content-Type': 'application/json',
             'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU1NzUyMTQ0MywiZXhwIjoxNTg5MDc5MDQzLCJhdWQiOiJodHRwczovL2Rpc3BlcnNhby1zY3JpcHRzLmhlcm9rdS5jb20iLCJpc3MiOiJtYWlyYXNhbGEiLCJzdWIiOiJzY3JpcHRzX2xvZyIsImp0aSI6IjEyMDNkNDhmLTQ4ZjYtNDU5Yi1iOGUyLTAwZTlmZDI5YmQ2ZiJ9.ck-R2_lJ1MuYh3ssY0p5RPKsdmAmAz_jirDweJgZHHk',
        },
}).then(response => response.json()); // parses JSON response into native JavaScript objects

let scriptsData = fetch('http://dispersao-scripts-api.herokuapp.com/scripts', {
  method: 'GET',
  headers: {
            'Content-Type': 'application/json',
             'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE1NjIyMzk2NDIsImV4cCI6MTU5Mzc5NzI0MiwiYXVkIjoiaHR0cHM6Ly9kaXNwZXJzYW8tc2NyaXB0cy5oZXJva3UuY29tIiwiaXNzIjoibWFpcmFzYWxhIiwic3ViIjoic2NyaXB0c19sb2ciLCJqdGkiOiJiYjNlNWYyZi1lYTc0LTQ4YWYtYmU4MC1hMDY5ZTRiNDlhZTMifQ.RpToXRIZR8_q41UFbgz3oyzusqDVVhGBe13VlasRE_o',
        },
}).then(response => response.json()); // parses JSON response into native JavaScript objects

Promise.all([oldData, newData, scriptsData]).then(([oldData, newData, scriptData]) => {
  // console.log(oldData)

  let mapedIds = oldData.data.map(seq => {
    let newSeq = newData.data.find(s=> s.sceneNumber === seq.sceneNumber)
    if(newSeq){
      if(seq.id !== newSeq.id){
        console.log(`changed: sceneNumber: ${seq.sceneNumber}, oldId: ${seq.id}, newId: ${newSeq.id}`)
      }
      return {sceneNumber: seq.sceneNumber, oldId: seq.id, newId: newSeq.id}
    } else {
      console.log('didint find in new '+seq.sceneNumber)
      return null
    }
  }).filter(Boolean)

// console.log(mapedIds)
debugger;

let newScripts = scriptData.data.map(script => {
    let newSeqs = script.sequences.map(s => mapedIds.find(mi => mi.oldId === s).newId)

    // console.log(`script ${script.name} old sequences: ${script.sequences}`)
    // console.log(`script ${script.name} new sequences: ${newSeqs}`)
    if(!isEqual(script.sequences, newSeqs)){
      console.log(`script ${script.name} old sequences: ${script.sequences}`)
      console.log(`script ${script.name} new sequences: ${newSeqs}`)
    } else {
      console.log('no changes on script '+script.name)
    }


    // return fetch(`http://dispersao-scripts-api.herokuapp.com/scripts/${script.id}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE1NjIyMzk2NDIsImV4cCI6MTU5Mzc5NzI0MiwiYXVkIjoiaHR0cHM6Ly9kaXNwZXJzYW8tc2NyaXB0cy5oZXJva3UuY29tIiwiaXNzIjoibWFpcmFzYWxhIiwic3ViIjoic2NyaXB0c19sb2ciLCJqdGkiOiJiYjNlNWYyZi1lYTc0LTQ4YWYtYmU4MC1hMDY5ZTRiNDlhZTMifQ.RpToXRIZR8_q41UFbgz3oyzusqDVVhGBe13VlasRE_o',
    //   },
    //   body: JSON.stringify({sequences:newSeqs})
    // }).then(response => response.json());
})

Promise.all(newScripts).then((scripts) => {
  console.log(scripts)
}).catch(e => console.log(e))



}).catch(e=> console.log(e))
//
// let mapedIds = oldData.data.map(seq => {
//   let newSeq = newData.data.find(s=> s.sceneNumber === seq.sceneNumber)
//   if(newSeq){
//     return {sceneNumber: seq.sceneNUmber, oldId: seq.id, newId: newSeq.id}
//   }
// }).filter(Boolean)
//
// console.log(newSeq)
