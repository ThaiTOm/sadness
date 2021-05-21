import React, { useMemo, useState, useEffect } from 'react'
import './App.css';
import { useHistory } from 'react-router-dom';
import { BrowserRouter, Switch, Route } from "react-router-dom"
import ActivatePage from './component/loginComponent/activate';
import Forget from './component/loginComponent/forget';
import ChangePassword from './component/loginComponent/changePassword';
import HomePage from './component/HomePage';
import Chat from './component/chatComponent/findChat';
import NewsMain from './component/newsComponents/newsMain';
import Main_block from './component/main.block';
import ViewOneBlog from './component/newsComponents/viewBlog/viewOneBlog';
import { Notifications, MessageList, PeerJS } from './userContext';
import axios from "axios"
import { getCookie } from './helpers/auth';
import socketApp from './socket';
import { toast } from "react-toastify"
import Policy from './component/anotherPage/policy';
import SuggestPage from './component/anotherPage/suggestPage';
import CreateShots from './component/anotherPage/createShot';
import AudioChatCom from './component/audioChatComponent/index';
import Peer from "peerjs"
import InRoom from "./component/audioChatComponent/inRoom"

function App() {
  let socket = socketApp.getSocket()
  const id = getCookie().token
  const [value, setValue] = useState([]);
  const [title, setTitle] = useState()
  const [listMessage, setListMessage] = useState(null)
  const notifications = useMemo(() => ({ value, setValue }), [value, setValue]);
  const messageList = useMemo(() => ({ listMessage, setListMessage }), [listMessage, setListMessage])
  const [end, setEnd] = useState(10);
  const history = useHistory()
  const [peer, setPeer] = useState(null)


  useEffect(() => {
    let newNull = () => {
      peer.destroy()
    }
    let createPeer = () => {
      var peerJS = new Peer(id, {
        host: "/",
        port: 2704,
        path: "/peerjs"
      })
      return peerJS
    }
    peer && newNull()
    let peerJS = createPeer()
    peerJS && setPeer(peerJS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // do not match two these useEffect 
  // This useEffect is use for recieve data from server
  useEffect(() => {
    let fncNotification = (arrNoti) => {
      // if user has notifications now 
      socket.once("activities", async (msg) => {
        // value is link to post 
        toast.info(msg.number + msg.value)
        let arr = { type: msg.type, value: msg.value, number: msg.number }
        let i = 0
        for await (let data of arrNoti) {
          // type (post,like,comment), value(link to that post)
          if (data.type === arr.type && data.value === arr.value) {
            let old = [...value]
            old.splice(i, 1)
            old.unshift(data)
            return setValue(old)
          }
          i++
        }
        setValue(a => [...a, arr])
      })
    }
    fncNotification(value)
  }, [value, socket])

  // fetch data
  useEffect(() => {
    // get notifications list
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

    // get message list
    axios.post(`http://localhost:2704/api/msgC/contactL?start=${end - 10}&end=${end}`, { id })
      .then(res => {
        if (res.data.message) history.push("/report")
        else setListMessage(res.data)
      }).catch(err => { })

  }, [id, end, history])

  useEffect(() => {

    let changeTitle = (idMessage, arr) => {
      if (idMessage !== id) setTitle("Bạn có 1 tin nhắn mới")
      return setListMessage(arr)
    }

    // check same value 
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
    // recieve message once
    let fnc = () => {
      let arr = [...listMessage]
      socket.once("message", msgs => msgs.type === "message" && forLoop(arr, msgs))
    }

    socket.on("reqShot", msg => {
      let arr = listMessage ? [...listMessage] : []
      arr.push(msg.mess)
      setListMessage(arr)
    }) && listMessage && listMessage.length > 0 && fnc()
  }, [listMessage, socket, id])

  useEffect(() => {
    // document.title = title
  }, [title])

  useEffect(() => {
    id && socket.emit("join", { id })
  }, [socket, id])

  return (
    <BrowserRouter >
      <Switch>
        <MessageList.Provider value={messageList}>
          <Notifications.Provider value={notifications}>
            <PeerJS.Provider value={{ peer, setPeer }}>
              {
                listMessage ? <Route exact path="/" >
                  <HomePage />
                </Route> : console.log()
              }
              {peer && <Route exact path="/podcast" render={props => <InRoom {...props} />} />}
            </PeerJS.Provider>
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
              path="/audio"
              component={AudioChatCom}
            />
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
            <Route path="/create/shots"
              render={props => <CreateShots {...props} />}
            />
          </Notifications.Provider>
        </MessageList.Provider >
      </Switch>
    </BrowserRouter>
  );
}

export default App;