export const scriptToStore = ({name, sequences})=>({
  name,
  sequences: sequences.map(s=> s.id)
})
