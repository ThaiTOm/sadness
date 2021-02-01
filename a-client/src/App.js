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
  const notifications = useMemo(() => ({ value, setValue }), [value, setValue]);

  useEffect(() => {
    axios.get("http://localhost:2704/api/news/notifications?id=" + id + "&start=0&end=10")
      .then(res => {
        if (res.data.value !== undefined) {
          for (let data of res.data.value) {
            console.log(data)
            let arr = {
              type: data.value,
              value: data.type,
              number: data.number
            }
            setValue(a => [...a, arr])
          }
        }
      }).catch(err => {
        console.log(err)
      })
  }, [id])

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
