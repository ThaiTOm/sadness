import React from 'react'
import "react-toastify/dist/ReactToastify.css"
import { isAuth } from "../helpers/auth";
import Main_page from "./main_page/main_page"
import HomepageNotAuth from "./loginComponent/PageNotAuth"


function HomePage() {

    return (
        <div className="main_page">
            { isAuth() ? < Main_page /> :
                <HomepageNotAuth />
            }
        </div >
    )
}

export default HomePage
