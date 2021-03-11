import React from 'react'
import "react-toastify/dist/ReactToastify.css"
import { isAuth } from "../helpers/auth";
import Mainpage from "./chatComponent/main_page"
import HomepageNotAuth from "./loginComponent/PageNotAuth"


function HomePage() {
    return (
        <div className="main_page">
            { isAuth() ? < Mainpage /> :
                <HomepageNotAuth />
            }
        </div >
    )
}

export default HomePage
