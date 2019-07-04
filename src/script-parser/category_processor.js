
const processCategories = (token) =>{
  let [catType, data] = token.text.split(':');
  if(data){
    data = getCategoryDaya(catType, data);

    data = data.map(d => ({
      text: d,
      type: catType
    }));

    return data;
  }
}

const getCategoryDaya = (type, data)=>{
  let dataProces = data.split('|').map(m => m.trim());
  if(type === 'pos'){
    dataProces = dataProces.map(d => parseInt(d))
  }
  return dataProces;
}

module.exports = processCategories
