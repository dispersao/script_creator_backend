import orderBy from 'lodash/orderBy'
import intersectionBy from 'lodash/intersectionBy'
import intersection from 'lodash/intersection'
import {calculateProbability} from './probabilityCalculator'
import {integer, real, MersenneTwister19937} from 'random-js'

export const scriptFormatToStore = ({name, sequences})=>({
  name,
  sequences: (sequences && sequences.map(s=> s.id)) || []
})

export const getRandomScriptSequences = (sequences, minutes) => {
  let scriptSequences = new Array()
  let sequence, sequenceId, availableNextSeqs, index
  let seconds = minutes * 60

  printPositions(sequences)

  let totalTime = 0

  do {
    // prevSeq = scriptSequences[scriptSequences.length -1]
    // index = prevSeq ? prevSeq.closestIndex : scriptSequences.length
    index = scriptSequences.length
    index++
    sequences = prepareSequencesFilter(sequences, scriptSequences)
    // console.log(sequences)
    availableNextSeqs = filterNextSequences(scriptSequences, sequences)
    // console.log('availableNextSeqs ' + availableNextSeqs.length)
    if(!availableNextSeqs.length){
      totalTime = seconds
    } else {
      availableNextSeqs = calculateProbability(index, availableNextSeqs)

      sequenceId = getNextSequence(availableNextSeqs, index)
      sequence = sequences.find(s => s.id === sequenceId.seq)

      sequences.splice(sequences.indexOf(sequence), 1)
      scriptSequences.push(sequence)
      totalTime += sequence.duration
    }

  }  while(totalTime < seconds)

  // return []

  return scriptSequences.map(s => s.id)
}



const prepareSequencesFilter = (sequences, played) => {
  let filteredSequences = sequences
  let blocked = []
  let playedIds = []
  if(played){
    played.forEach(s => {
      playedIds.push(s.sceneNumber)
      let blockedBySeq = filterSeqCategoriesByType(s, 'blocks').map(cat => cat.text)
      blocked = blocked.concat(blockedBySeq)
    })
  }

  return filteredSequences.map(seq => {
    const requires = filterSeqCategoriesByType(seq, 'requires').map(cat => cat.text)
    const requireDisabled = intersection(requires, playedIds).length === requires.length
    // console.log(seq, requires, requireDisabled)
    return {
      ...seq,
      enabled: !blocked.includes(seq.sceneNumber) && requireDisabled
    }
  })
}

const filterNextSequences = (prevSeqs, sequences) => {
  const prevSeq = prevSeqs.slice(-1)[0]
  const prevprevSeq = prevSeqs.slice(-2)[0]

  return sequences.filter(el => {
    const sameLocation = prevSeq && el.location.id === prevSeq.location.id
    const sameChars = prevSeq && prevSeq.characters.length && prevSeq.characters.every(ch => el.characters.map(ch => ch.id).includes(ch.id))
    const sameGroupLevel2 = prevSeq && prevprevSeq && intersectionBy(filterSeqCategoriesByType(prevprevSeq, 'blocks-2nd-next'), filterSeqCategoriesByType(prevSeq, 'blocks-2nd-next'), filterSeqCategoriesByType(el, 'blocks-2nd-next'), 'id')
    const sameGroupLevel1 = prevSeq && intersectionBy(filterSeqCategoriesByType(prevSeq, 'blocks-next'), filterSeqCategoriesByType(el, 'blocks-next'), 'id')

    return el.enabled && !(sameLocation && sameChars) && !(sameGroupLevel2 && sameGroupLevel2.length) && !(sameGroupLevel1 && sameGroupLevel1.length)
  })
}


const getNextSequence = (seqs, index) => {
  if(seqs.length === 1){
    return seqs[0]
  }
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
    return s
  })
  let orderSeqs = orderBy(seqs, 'perc', 'desc')

  // let positions = [...new Set(seqs.map(s => s.dist))]
  // positions = orderBy(positions.map(p => {
  //   const sf = seqs.filter(s => s.dist === p).map(s => s.range.high - s.range.low)
  //   return {
  //     d: p,
  //     range: sf.reduce((a, b)=>a+b),
  //     amount: sf.length
  //   }
  // }), 'range', 'desc')
  let selectedSeq
  do{
    engine = MersenneTwister19937.autoSeed()
    distribution = real(0, limit)
    const seed = distribution(engine)
    // console.log('position: ' + index+ ' seed:' + seed)
    selectedSeq = orderSeqs.find(s => s.range.low >= seed && seed <= s.range.high)
  } while (!selectedSeq)

  // console.log('selected: ', selectedSeq)
  return selectedSeq
}


const printPositions = (sequences)=>{
  let categories = new Array(78).fill({pos: 0, am: 0}).map((n, i) => ({...n, seqs: new Array(), pos:(i+1)}))
  sequences.forEach(s => {
    let scats = filterSeqCategoriesByType(s, 'pos')
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
    delete categories[key].seqs
  })

  const cleanSeqs = sequences.map(s => {
    return {
      seq: s.sceneNumber,
      pos: filterCategoriesByType(s.categories, 'pos').map(c => c.text).join(' | ')
    }
  })

  console.log(JSON.stringify(categories))
  console.log(JSON.stringify(cleanSeqs))
}

const filterSeqCategoriesByType = (sequence, type)=> {
  return filterCategoriesByType(sequence.categories, type)
}

const filterCategoriesByType = (categories, type) => {
  return categories.filter(c => c.type === type)
}
