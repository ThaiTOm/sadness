import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import ActivatePage from './component/loginComponent/activate';
import Forget from './component/loginComponent/forget';
import ChangePassword from './component/loginComponent/changePassword';
import HomePage from './component/HomePage';
import Chat from './component/chatComponent/chat';
import NewsMain from './component/newsComponents/newsMain';
import Main_block from './component/blockComponent/main.block';
import ViewOneBlog from './component/newsComponents/viewBlog/viewOneBlog';

function App() {
  return (
    <Router >
      <Switch>
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
      </Switch>
    </Router>
  );
}

export default App;
