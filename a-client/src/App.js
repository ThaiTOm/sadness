import './App.css';
import { BrowserRouter, Switch, Route } from "react-router-dom"
import ActivatePage from './component/loginComponent/activate';
import Forget from './component/loginComponent/forget';
import ChangePassword from './component/loginComponent/changePassword';
import HomePage from './component/HomePage';
import Chat from './component/chatComponent/chat';
import NewsMain from './component/newsComponents/newsMain';
import Main_block from './component/blockComponent/main.block';
import ViewOneBlog from './component/newsComponents/viewBlog/viewOneBlog';
import { Notifications } from './userContext';
import React, { useMemo, useState, useEffect } from 'react'
import axios from "axios"
import { getCookie } from './helpers/auth';


function App() {
  const id = getCookie().token
  const [value, setValue] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const notifications = useMemo(() => ({ value, setValue }), [value, setValue]);

  useEffect(() => {
    axios.get("http://localhost:2704/api/news/notifications?id=" + id + "&start=" + start + "&end=" + end)
      .then(async res => {
        for await (let data of res.data.value) {
          setValue(a => [...a, data])
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <BrowserRouter >
      <Switch>
        <Notifications.Provider value={notifications}>
          <Route exact path="/" >
            <HomePage />
          </Route>
          <Route
            path="/users/active/:token"
            exact
            render={props => <ActivatePage {...props} />}
          />
          <Route
            path="/users/forget"
            exact
            render={props => <Forget {...props} />}
          />
          <Route
            path="/users/password/forget/:token"
            exact
            render={props => <ChangePassword {...props} />}
          />
          <Route
            path="/chat"
            component={Chat} />
          <Route
            path="/news"
            component={NewsMain} />
          <Route
            path="/report"
            component={Main_block} />
          <Route
            path="/posts/id=:id"
            render={props => <ViewOneBlog {...props} />}
          />
        </Notifications.Provider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
