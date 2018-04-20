import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import configureStore from '../store/configureStore';
import MyPage from '../containers/MyPage';


//Needed for React Developer Tools
window.React = React;

injectTapEventPlugin();

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
      <BrowserRouter>
          <Route path="/" component={MyPage}/>
      </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
