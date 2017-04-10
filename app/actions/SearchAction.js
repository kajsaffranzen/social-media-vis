import SearchDispatcher from '../Dispatcher';

const Action = {
  getData(coord){
    SearchDispatcher.dispatch({
        type: 'SEARCH',
        coord,
    });
  },
};

export default Action;
