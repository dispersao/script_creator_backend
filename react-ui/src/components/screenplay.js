import React, { Component } from 'react';
import Sequence from './sequence';
import _ from 'lodash';



class Screenplay extends Component {

  constructor(props){
    super(props);
    this.state = {sequences: [], loading:false, filters:{}};
    this.onSequenceFetched = this.onSequenceFetched.bind(this);
  }

  render() {
    const seqsRendered = this.state.sequences.map((sequence, idx)=>{
      return (
        <Sequence key={idx}
        id={sequence.id}
        type={sequence.type}
        location={sequence.location}
        parts={sequence.parts}
        reducedView={this.props.reducedView}>
        </Sequence>
      )
    });

    return (
      <div className="ScreenplayContainer">
        <div className="Screenplay">
          {seqsRendered}
        </div>
      </div>
    );
  }

  componentDidMount() {
    // console.log('Screenplay: componentmounting');
  }
  componentWillUpdate() {
    // console.log("Screenplay: componentWillUpdate");
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.filters && JSON.stringify(nextProps.filters) !== JSON.stringify(this.props.filters)){
      if(nextProps.filters.sequences[0] === 'all'){
        this.loadSequencesForList(nextProps.filters);
      } else if(nextProps.filters.sequences[0].indexOf('script') >=0){
        this.generateRandomScript(nextProps.filters);
      }
    }
  }

  loadSequencesForList(filters){
    this.setSequencePlayed(false)
    .then((result)=>{
      this.setState({'sequences': [],  currentSequence: null, loading: true});
      const queryFilters = this.getFiltersFormattedForQuery(filters);

      return fetch(`/api/sequences?${queryFilters}`)
    })
    .then(res => res.json())
    .then(resJson => this.handleErrors(resJson, this.loadSequencesForList, filters))
    .then(sequences => this.onSequencesFetched(sequences))
    .catch(e => console.log(`loadSequencesForList fetch error: ${e}`))
  }

  generateRandomScript(filters){
    this.setSequencePlayed(false)
    .then(result => {
      this.setState({sequences: [], currentSequence: null, loading: true});
      this.loadSequenceForScript(filters)
    });
  }

  loadSequenceForScript(filters){
    let modifiedFilters = filters || {};
    if(this.state.currentSequence){
      modifiedFilters = this.getNextSequenceFilters(modifiedFilters);
    }
    modifiedFilters = Object.assign(modifiedFilters, {count:1, order:'rand'});

    let queryString = this.getFiltersFormattedForQuery(modifiedFilters );
    let [url, params] = this.getRequestUrlAndParamas('get', `?${queryString}`);

    fetch(url, params)
    .then(res => res.json())
    .then(resJson => this.handleErrors(resJson, this.loadSequenceForScript, filters))
    .then(sequence=> this.onSequenceFetched(sequence))
    .then(resJson => this.handleErrors(resJson, this.onSequenceFetched, this.state.currentSequence))
    .then(sequence => this.onSequenceSettedAsPlayed(sequence))
    .catch(e => console.log(`Screenplay.loadSequenceForScript fetch error: ${e}`))

  }

  onSequencesFetched(sequences){
    this.setState({ 'sequences': sequences, loading: false });
    this.props.onLoad();
  }

  onSequenceSettedAsPlayed(sequence){
    if(this.state.sequences.length < this.props.scriptLength){
      this.loadSequenceForScript(this.props.filters);
    } else {
      this.setState({ loading: false });
      this.props.onLoad();
    }
  }
  onSequenceFetched(sequence) {
    const sequences = _.uniq(this.state.sequences.concat(sequence));
    this.setState({
        sequences: sequences,
        currentSequence: sequence
      });
    return this.setSequencePlayed(true, sequence);
  }

  handleErrors(resJson, method, params) {
    if(resJson.status && resJson.status === 'error'){
      if(resJson.errorno === 1226){
        setTimeout(()=> method.apply(this, [params]), 1500);
      } else{
        this.setState({loading:false});
      }
      throw Error(`${resJson.code}::${resJson.errorno}::${resJson.message}`);

    } else {
      return resJson;
    }
  }

  setSequencePlayed(hasPlayed, sequence){
    const complement = sequence ? `/${sequence.id}` : '';
    const [url, params] = this.getRequestUrlAndParamas('post', complement, {'hasPlayed':hasPlayed});
    return fetch(url, params);
  }

  getRequestUrlAndParamas(method, complement, body){
    const url = `/api/sequences${complement}`;
    const params = {
      method: method.toUpperCase(),
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    if(body){
      params.body = JSON.stringify(body);
    }
    return [url, params];
  }

  getFiltersFormattedForQuery(filters, extra){
    delete filters["sequences"];

    const mapedFilters = Object.keys(filters).map(key => {
      let filterStr = '';

      if(filters[key]['ids']){
        filterStr = `filter[${key}][ids]=${filters[key]['ids'].join(',')}`;
      }
      if(filters[key]['exclusive']){
        filterStr+=`&filter[${key}][exclusive]=1`;
      }
      if(filters[key]['and']){
        filterStr+=`&filter[${key}][and]=1`
      } else {
        filterStr+=`${key}=${filters[key]}`;
      }
      return filterStr;
    });
    return mapedFilters.filter(Boolean).join("&");
  }

  getNextSequenceFilters(filters){
    filters.characters = filters.characters || {};
    filters.characters.and = true;
    filters.characters.exclusive = true;
    let characters = this.state.currentSequence.parts.map(p => {
      return p.characters.map(c => c.id);
    });
    characters = [].concat(...characters);
    characters = [...new Set(characters)];
    filters.characters.ids = characters;
    filters.locations = filters.locations || {};
    filters.locations.ids = [this.state.currentSequence.location.id];
    filters.locations.exclusive = true;
    return filters;
  }
}

export default Screenplay;
