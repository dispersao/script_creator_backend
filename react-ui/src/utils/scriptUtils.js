import orderBy from 'lodash/orderBy'
import {calculateProbability} from './probabilityCalculator'
import {integer, real, MersenneTwister19937} from 'random-js'

export const scriptFormatToStore = ({name, sequences})=>({
  name,
  sequences: (sequences && sequences.map(s=> s.id)) || []
})

export const getRandomScriptSequences = (sequences, minutes) => {
  let scriptSequences = new Array()
  let sequence, sequenceId, prevSeq, availableNextSeqs, index
  let seconds = minutes * 60

  // printPositions(sequences)

  let totalTime = 0

  do {
    prevSeq = scriptSequences[scriptSequences.length -1]
    // index = prevSeq ? prevSeq.closestIndex : scriptSequences.length
    index = scriptSequences.length
    index++
    availableNextSeqs = filterNextSequences(prevSeq, sequences)
    if(!availableNextSeqs.length){
      totalTime = seconds
    }
    // availableNextSeqs = calculateProbabilities(index, availableNextSeqs)
    availableNextSeqs = calculateProbability(index, availableNextSeqs)
    // let probabilities = calculateProbability(index, availableNextSeqs)
    // console.log(probabilities)

    sequenceId = getNextSequence(availableNextSeqs, index)
    sequence = sequences.find(s => s.id === sequenceId.seq)

    sequences.splice(sequences.indexOf(sequence), 1)
    scriptSequences.push(sequence)
    totalTime += sequence.duration

  }  while(totalTime < seconds)

  // return []

  return scriptSequences.map(s => s.id)
}

const filterNextSequences = (prevSeq, sequences) => {
  if(!prevSeq) return sequences
  return sequences.filter(el => {
    return el.location !== prevSeq.location && (!prevSeq.characters.length || !prevSeq.characters.every(ch => el.characters.includes(ch)))
  })
}

// const calculateProbabilities = (pos, sequences) => {
//
//   let procSeqs = calculatePositionDistance(pos, sequences)
//   return procSeqs
// }
//
// const calculatePositionDistance = (pos, seqs) => {
//   return seqs.map(s => {
//     let orderPos = s.categories
//       .filter(cat => cat.type === 'pos')
//       .map(cat => parseInt(cat.text))
//       .sort((a, b) => {
//         let adist = Math.abs(pos - a)
//         let bdist = Math.abs(pos - b)
//         if(adist < bdist) return -1
//         if(adist > bdist) return 1
//         else return 0
//       })
//     let dist = Math.abs(pos - orderPos[0])
//     // console.log(`pos:${pos} seq:${s.sceneNumber} positions:[${orderPos.join(',')}] dist:${dist} prob:${1/(dist + 1)}`)
//     return {
//       ...s,
//       closestIndex: orderPos[0],
//       posDist: Math.abs(dist),
//       posProb: 1/(dist + 1)
//     }
//   })
// }

const getNextSequence = (seqs, index) => {
  let engine = MersenneTwister19937.autoSeed()
  let distribution = integer(0, 1)
  seqs = seqs.sort(()=>{
    const seed = distribution(engine)
    if(seed === 0) return 1
    if(seed === 1) return -1
  })
  let limit = 0
  seqs = seqs.map(s => {
    s.range = {
      low: limit,
      high: limit + s.perc
    }
    limit += s.perc
    // console.log(`seq:${s.seq} perc:${s.perc} range:[${s.range.low}-${s.range.high}]`)
    return s
  })
  let orderSeqs = orderBy(seqs, 'perc', 'desc')
  console.log(orderSeqs)

  let positions = [...new Set(seqs.map(s => s.dist))]
  positions = orderBy(positions.map(p => {
    const sf = seqs.filter(s => s.dist === p).map(s => s.range.high - s.range.low)
    return {
      d: p,
      range: sf.reduce((a, b)=>a+b),
      amount: sf.length
    }
  }), 'range', 'desc')
  console.log('acumulation of percentage per position', positions)
  // debugger
  // positions.forEach(f => console.log(`for index ${index} dist:${f.d} range:${f.range} amount:${f.am} in limit:${limit}`))

  engine = MersenneTwister19937.autoSeed()
  distribution = real(0, limit)
  const seed = distribution(engine)
  console.log('position: ' + index+ ' seed:' + seed)

  const selectedSeq = orderSeqs.find(s => s.range.low >= seed && seed <= s.range.high)

  console.log('selected: ', selectedSeq)
  // let nextSeq = seqs.find(s => s.range.low >= seed && seed <= s.range.high)
  // console.log(`seed ${seed}, seq: ${nextSeq.sceneNumber} dist:${nextSeq.posDist}`)
  return selectedSeq
}


const printPositions = (sequences)=>{
  let categories = new Array(78).fill({pos: 0, seqs: [], am: 0}).map((n, i) => ({...n, pos:(i+1)}))
  sequences.forEach(s => {
    let scats = s.categories.filter(c => c.type === 'pos')
    scats.forEach(scat => {
      const cat = categories.find(cate => cate.pos === parseInt(scat.text))
      cat.seqs.push(s.sceneNumber)
      cat.am++
      // categories[parseInt(scat.text)] = categories[scat.text] || {sequences: [], amount:0}
      // categories[parseInt(scat.text)].sequences.push(s.sceneNumber)
      // categories[parseInt(scat.text)].amount++
    })
  })

  Object.keys(categories).forEach(key => {
    categories[key].sequences = categories[key].seqs.join(' | ')
  })

  const cleanSeqs = sequences.map(s => {
    return {
      seq: s.sceneNumber,
      pos: s.categories.filter(c => c.type === 'pos').map(c => c.text).join(' | ')
    }
  })

  console.log(JSON.stringify(categories))
  console.log(JSON.stringify(cleanSeqs))
}
