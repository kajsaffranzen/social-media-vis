import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import SearchDispatcher from './Dispatcher';
import http from 'http';
import $ from 'jquery';
import p from 'es6-promise';
//import service from './SearchService';

class SearchStore extends ReduceStore {
  constructor(){
    super(SearchDispatcher);
  }

//TODO: add an Immutable, example from Reflux-todo.
  getInitialState(){
    return Immutable.OrderedMap();
  }

  reduce(state, action){
    switch (action.type) {
      case 'SEARCH':
        //http.get('/film/finding-nemo');
        let coords = action.coord.lat+','+action.coord.lng;
        /*let h = new p.Promise(function(resolve, reject){
          $.ajax({
            type: 'GET',
            //data: state,
            url: '/twitter/'+coords,
          }).then(function(res){
            console.log('Hämtat data!');
          });
        })*/
        return state;
      default:
        return state;

    }
  }
}

export default new SearchStore();
