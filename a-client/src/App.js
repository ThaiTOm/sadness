import React, { useMemo, useState, useEffect } from 'react'
import './App.css';
import { useHistory } from 'react-router-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom"
import ActivatePage from './component/loginComponent/activate';
import Forget from './component/loginComponent/forget';
import ChangePassword from './component/loginComponent/changePassword';
import HomePage from './component/HomePage';
import Chat from './component/chatComponent/chat';
import NewsMain from './component/newsComponents/newsMain';
import Main_block from './component/main.block';
import ViewOneBlog from './component/newsComponents/viewBlog/viewOneBlog';
import { Notifications, MessageList } from './userContext';
import axios from "axios"
import { getCookie } from './helpers/auth';
import socketApp from './socket';
import { toast } from "react-toastify"
import Policy from './component/anotherPage/policy';
import SuggestPage from './component/anotherPage/suggestPage';

function App() {
  let socket = socketApp.getSocket()
  const id = getCookie().token
  const [value, setValue] = useState([]);
  const [title, setTitle] = useState(null)
  const [listMessage, setListMessage] = useState(null)
  const notifications = useMemo(() => ({ value, setValue }), [value, setValue]);
  const messageList = useMemo(() => ({ listMessage, setListMessage }), [listMessage, setListMessage])
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const history = useHistory()

  let changeTitle = (idMessage, arr) => {
    if (idMessage !== id) setTitle("Bạn có 1 tin nhắn mới")
    return setListMessage(arr)
  }
  let forLoop = (arr, msgs) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].idRoom === msgs.idRoom && i !== 0) {
        arr.splice(i, 1)
        arr.unshift(msgs)
        return changeTitle(msgs.data.id, arr)
      }
      else if (arr[i].idRoom === msgs.idRoom && i === 0) {
        arr[0] = msgs
        return changeTitle(msgs.data.id, arr)
      }
    }
  }
  let fnc = () => {
    let arr = [...listMessage]
    socket.once("message", msgs => msgs.type === "message" && forLoop(arr, msgs))
  }

  useEffect(() => {
    id && socket.emit("join", { id })
    socket.on("activities", msg => toast.info(msg.number + msg.value))
  }, [socket, id])

  // fetch data
  useEffect(() => {
    axios.get("http://localhost:2704/api/news/notifications?id=" + id + "&start=0&end=10")
      .then(res => {
        let fnc = () => {
          for (let data of res.data.value) {
            let arr = {
              type: data.value,
              value: data.type,
              number: data.number
            }
            setValue(a => [...a, arr])
          }
        }
        res.data.value !== undefined && fnc()
      }).catch(err => { })

    axios.post("http://localhost:2704/api/msgC/contactL?start=" + start + "&end=" + end, { id })
      .then(res => {
        if (res.data.message) history.push("/report")
        else setListMessage(res.data)
      }).catch(err => { })
  }, [id, end])

  useEffect(() => {
    listMessage && listMessage.length > 0 && fnc()
  }, [listMessage])

  useEffect(() => {
    document.title = title
  }, [title])
  return (
    <BrowserRouter >
      <Switch>
        <MessageList.Provider value={messageList}>
          <Notifications.Provider value={notifications}>
            {
              listMessage ? <Route exact path="/" >
                <HomePage />
              </Route> : console.log()
            }
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
            <Route path="/policy"
              render={props => <Policy {...props} />}
            />
            <Route path="/suggest"
              render={props => <SuggestPage {...props} />}
            />
          </Notifications.Provider>
        </MessageList.Provider >
      </Switch>
    </BrowserRouter>
  );
}

export default App;
