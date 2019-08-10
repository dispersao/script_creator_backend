import orderBy from 'lodash/orderBy'

const VELOCITY = 5
const LIMIT = 1
const MAX_SCENES_AMOUNT = 10
const NON_ZERO_POS_ADDEND = 1
const NON_ZERO_PROB_ADDEND = 1
const FORMULA_FACTOR = 2
const FORMULA_ADDEND = 0.5

export const calculateProbability = (position, sequences) => {
  const sequencesWithDist = calculatePositionDistance(position, sequences)
  const sequencesByPosition = getSequencesPerPosition(sequencesWithDist)
  const positionsWithProbability = getPositionProbability(sequencesByPosition)
  const sequencesWithProbability = getSequenceProbabilities(positionsWithProbability.positions)
  return sequencesWithProbability
}

const calculatePositionDistance = (pos, seqs) => {
  return seqs.map(s => {
    let orderPos = s.categories
      .filter(cat => cat.type === 'pos')
      .map(cat => parseInt(cat.text))
      .sort((a, b) => {
        let adist = Math.abs(pos - a)
        let bdist = Math.abs(pos - b)
        if(adist < bdist) return -1
        if(adist > bdist) return 1
        else return 0
      })
    let dist = Math.abs(pos - orderPos[0])
    return {
      closestPos: orderPos[0],
      posDist: Math.abs(dist),
      sequence: s.id,
      sNum: s.sceneNumber
    }
  })
}

const getSequencesPerPosition = (seqs) => {
  let positions = []
  seqs.forEach(s => {
    let cat = positions.find(c => c.dist === s.posDist)
    if(!cat){
      cat = {
        dist: s.posDist,
        sequences: [],
        sceneNumbers: []
      }
      positions.push(cat)
    }
    cat.sequences.push(s.sequence)
    cat.sceneNumbers.push(s.sNum)
  })
  const orderedPositions = orderBy(positions, 'dist')
  // console.log(orderedPositions)
  return orderedPositions
}

const getPositionProbability = (positions) => {
  let positionsModified = positions.map(pos => {
    const positionTotScenes = Math.min(pos.sequences.length, MAX_SCENES_AMOUNT)
    const factor = positionTotScenes/(NON_ZERO_POS_ADDEND + pos.dist)
    return {
      ...pos,
      seqsAmount: positionTotScenes,
      factor: factor
    }
  })

  const totalAvailableScenes = positionsModified.reduce((a, b) => ({
    factor: a.factor + b.factor
  })).factor

  let lastPercentage = 0

  positionsModified.forEach((pos, index) => {
    let totalScenesUntilMe = positionsModified
      .slice(0, index + 1)
      .reduce((a, b) => ({
        factor: a.factor + b.factor
      }))
      .factor

    let positionSumPercentage = FORMULA_FACTOR * (LIMIT / (NON_ZERO_PROB_ADDEND + Math.exp(-VELOCITY * (totalScenesUntilMe / totalAvailableScenes))) - FORMULA_ADDEND)

    // console.log(`pos ${pos.dist} with ${pos.seqsAmount} seqs accumulates ${positionSumPercentage}`)

    pos.percentage = positionSumPercentage - lastPercentage
    lastPercentage = positionSumPercentage
  })
  return {
    positions: positionsModified,
    limit: lastPercentage
  }
}

const getSequenceProbabilities = (positions) => {
  let sequences = []
  positions.forEach(pos => {
    const seqProbValue = pos.percentage / pos.sequences.length
    pos.sequences.forEach(seq => {
      sequences.push({ seq, perc:seqProbValue, dist: pos.dist})
    })
  })
  return sequences
}
