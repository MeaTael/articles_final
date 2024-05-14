import Article from "./pages/article";
import ArticleCopy from "./pages/articleRef";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth"
import Home from "./pages/home"

import {HOME_ROUTE, ARTICLE_ROUTE, PROFILE_ROUTE, REGISTRATION_ROUTE, LOGIN_ROUTE} from "./utils/consts";

export const authRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: <Profile/>
    }
]

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: <Home/>
    },
    {
        path: ARTICLE_ROUTE + '/:id',
        Component: <Article/>
    },
    {
        path: ARTICLE_ROUTE + '/:id' + '/:fromArticle',
        Component: <ArticleCopy/>
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <Auth/>
    },
    {
        path: LOGIN_ROUTE,
        Component: <Auth/>
    }
]