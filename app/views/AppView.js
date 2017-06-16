import React from 'react';
import SearchView from '../components/Search.jsx';

function AppView(props) {
  return (
    <div>
      <Main {...props} />
      <Search {...props} />
    </div>
  );
}

function Search(props){
    return <SearchView/>
}


function Main(props) {
  if (props.data.size === 0) {
    return null;
  }
  return (
    <section id="main">
      <ul id="data-list">
        {[...props.data.values()].reverse().map(d => (
          <li key={d.id}>
            <div className="view">
              <label>{d.place}</label>
            </div>
            <div className="view">
              <label>{d.lng}</label>
            </div>
          </li>

        ))}
      </ul>
    </section>
  );
}


export default AppView;
