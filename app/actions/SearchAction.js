import SearchDispatcher from '../Dispatcher';

const Action = {
  getData(coord){
    SearchDispatcher.dispatch({
        type: 'SEARCH',
        coord,
    });
  },
  addTodo(text){
      SearchDispatcher.dispatch({
      type: 'ADD_TODO',
      text,
    });
},
};

export default Action;
