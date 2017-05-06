import SearchStore from './SearchStore'
import {Container} from 'flux/utils';
import SearchView from './components/Search.jsx'
import AppView from './views/AppView';

function getStores() {
  return [
    SearchStore,
  ];
}

function getState() {
  return {
    data: SearchStore.getState(),
  };
}
export default Container.createFunctional(AppView, getStores, getState);


//TODO: kolla så att det verklingen inte finns en query for posts som bara innehåller lng, lat koords
