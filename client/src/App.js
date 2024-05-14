import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import Article from './pages/article';
import ArticleCopy from './pages/articleRef';

import NavBar from "./components/NavBar";
import AppRouter from "./components/AppRouter";
import {observer} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {check} from "./http/userApi";

const App = observer( () => {

    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        check().then(data => {
            user.setUser(data)
            user.setIsAuth(true)
        }).catch(() => {
            user.setUser({})
            user.setIsAuth(false)
        }).finally(() => {
            setLoading(false)
        })
    }, [])

  return (
    /*<>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="articles/:id" element={<Article/>} />
        <Route path="articles/:id/:fromArticle" element={<ArticleCopy/>} />
      </Routes>
    </>*/
      <Router>
        <NavBar/>
          {loading ? <></> : <AppRouter/>}
      </Router>
  );
});

export default App;