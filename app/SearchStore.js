import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import SearchDispatcher from './Dispatcher';
import TwitterData from './data/TwitterData';
import http from 'http';
import $ from 'jquery';
import p from 'es6-promise';
//import service from './SearchService';

class SearchStore extends ReduceStore {
  constructor(){
    super(SearchDispatcher);
  }

//TODO: add an Immutable, example from Reflux-todo.
  getInitialState() {
      return Immutable.OrderedMap();
  }

  //TODO: move promise to another file so that the state can be returned
  reduce(state, action){
    switch (action.type) {
        case 'ADD_TODO':
            var id = 1;
            return state.set(id, new TwitterData({
              id,
              place: action.text,
            }));

      case 'SEARCH':
        let coord = action.coord.lat+','+action.coord.lng;
        console.log('coords: ', coord);
        let h = new p.Promise(function(resolve, reject){
          $.ajax({
            type: 'GET',
            url: '/twitter/'+coord,
          }).then(function(res){
              console.log('Hämtat data! ', res);
              //console.log(res);
          });
      })

      return state.set(1, {
          place: action.coord.city,
          lng: action.coord.lng,
         /* lat: action.coord.lat,
          tweets: 'empty',*/
      })

      default:
        return state;
    }
  }
}

export default new SearchStore();
