import SearchStore from './SearchStore'
import {Container} from 'flux/utils';
import SearchView from './components/Search.jsx'

function getStores() {
    console.log('getStores');
  return [
    SearchStore,
  ];
}

function getState() {
    console.log('getState');
  return {
    todos: SearchStore.getState(),
  };
}

//export default Container.createFunctional(SearchView, getStores, getState);
