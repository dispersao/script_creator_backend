export const scriptFormatToStore = ({name, sequences})=>({
  name,
  sequences: (sequences && sequences.map(s=> s.id)) || []
})

export const getRandomScriptSequences = (sequences, total) => {
  let scriptSequences = new Array(total).fill(null);
  let sequence, seed, prevSeq;

  scriptSequences = scriptSequences.map((el,index) => {
    if(index === 0){
      seed = Math.floor(Math.random() * Math.floor(sequences.length - 1))
    } else {
      let possibleNextSequences = sequences.filter(el => {
        return el.location !== prevSeq.location && !prevSeq.characters.every(ch => el.characters.includes(ch))
      })
      if(!possibleNextSequences.length) return undefined;
      seed = Math.floor(Math.random() * Math.floor(possibleNextSequences.length - 1))
      seed = sequences.indexOf(possibleNextSequences[seed])
    }
    prevSeq = sequence = sequences.splice(seed, 1)[0];
    console.log(index, sequence.id);
    return sequence.id;
  })
  return scriptSequences.filter(Boolean);
}
