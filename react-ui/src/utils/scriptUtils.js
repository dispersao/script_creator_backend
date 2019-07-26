export const scriptFormatToStore = ({name, sequences})=>({
  name,
  sequences: (sequences && sequences.map(s=> s.id)) || []
})

export const getRandomScriptSequences = (sequences, minutes) => {
  let scriptSequences = new Array()
  let sequence, seed, prevSeq
  let seconds = minutes * 60

  let totalTime = 0

  do {
    let index = scriptSequences.length
    if(index === 0){
      seed = Math.floor(Math.random() * Math.floor(sequences.length - 1))
    } else {
      prevSeq = scriptSequences[scriptSequences.length -1]
      let possibleNextSequences = sequences.filter(el => {
        return el.location !== prevSeq.location && (!prevSeq.characters.length || !prevSeq.characters.every(ch => el.characters.includes(ch)))
      })
      if(!possibleNextSequences.length){
        totalTime = seconds
      }
      seed = Math.floor(Math.random() * Math.floor(possibleNextSequences.length - 1))
      seed = sequences.indexOf(possibleNextSequences[seed])
    }
    sequence = sequences.splice(seed, 1)[0]
    scriptSequences.push(sequence)
    totalTime += sequence.duration

  }  while(totalTime < seconds)

  return scriptSequences.map(s => s.id)
}
export const getRandomScriptSequencesOld = (sequences, total) => {
  let scriptSequences = new Array(total).fill(null);
  let sequence, seed, prevSeq;

  scriptSequences = scriptSequences.map((el,index) => {
    if(index === 0){
      seed = Math.floor(Math.random() * Math.floor(sequences.length - 1))
    } else {
      let possibleNextSequences = sequences.filter(el => {
        return el.location !== prevSeq.location && (!prevSeq.characters.length || !prevSeq.characters.every(ch => el.characters.includes(ch)))
      })
      if(!possibleNextSequences.length) return undefined;
      seed = Math.floor(Math.random() * Math.floor(possibleNextSequences.length - 1))
      seed = sequences.indexOf(possibleNextSequences[seed])
    }
    prevSeq = sequence = sequences.splice(seed, 1)[0];
    return sequence.id;
  })
  return scriptSequences.filter(Boolean);
}
