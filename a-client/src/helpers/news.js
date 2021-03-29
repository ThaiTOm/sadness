import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { MenuItem, Menu, Button } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { signOut } from './auth';
import IconButton from '@material-ui/core/IconButton';


export const ImageRender = (cb) => {
    const { value } = cb.props
    switch (value.image.length) {
        case 0:
            return <div></div>
        case 1:
            return <div className="one">
                <Link to={"/posts/id=" + value.idBlog}>
                    <img
                        alt={value.image[0].slice(100, 110)}
                        src={value.image[0]}
                    />
                </Link>
            </div>
        case 2:
            return <div className="two">
                <Link to={"/posts/id=" + value.idBlog}>
                    <img
                        alt={value.image[0].slice(100, 110)}

                        src={value.image[0]}></img>
                    <img
                        alt={value.image[1].slice(100, 110)}

                        src={value.image[1]}></img>
                </Link>
            </div>

        case 3:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}

                            src={value.image[0]}></img>
                        <img

                            alt={value.image[1].slice(100, 110)}
                            src={value.image[1]}></img>
                    </div>
                    <img
                        alt={value.image[2].slice(100, 110)}

                        src={value.image[2]}></img>
                </Link>
            </div>

        case 4:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}

                            src={value.image[0]}></img>
                        <img
                            alt={value.image[1].slice(100, 110)}

                            src={value.image[1]}></img>
                    </div>
                    <div className="two">
                        <img
                            alt={value.image[2].slice(100, 110)}

                            src={value.image[2]}></img>
                        <img
                            alt={value.image[3].slice(100, 110)}

                            src={value.image[3]}></img>
                    </div>
                </Link>
            </div>
        default:
            return <div className="three">
                <Link to={"/posts/id=" + value.idBlog}>
                    <div className="two">
                        <img
                            alt={value.image[0].slice(100, 110)}

                            src={value.image[0]}></img>
                        <img
                            alt={value.image[0].slice(10, 100)}

                            src={value.image[1]}></img>
                    </div>
                    <div className="two" >
                        <img
                            alt={value.image[1].slice(100, 110)}

                            src={value.image[2]}></img>
                        <div style={{ position: "relative", width: "90%" }}>
                            <img
                                alt={value.image[2].slice(100, 110)}
                                className="more_image"
                                src={value.image[3]}></img>
                            <span className="last_image">
                                + {value.image.length - 4}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
    }
}

export const HeaderPage = (props) => {
    let value = props.value || []
    let arr = window.location.href.split("/")
    const [openNoti, setOpenNoti] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [valueSearch, setValueSearch] = useState("")
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        signOut();
        window.location.reload(false);
    }
    const handleClickNoti = (e) => {
        setOpenNoti(e.currentTarget)
    }
    const handleCloseNoti = () => {
        setOpenNoti(null);
    };
    return (
        <div className="navbar_auth">
            <p id="recal"> Recal </p>
            {arr[3] === "news" ? <form className="search_div">
                <input
                    placeholder="Tìm kiếm"
                    value={valueSearch}
                    onChange={e => setValueSearch(e.target.value)}
                />
                <IconButton type="submit">
                    <img alt="search_image_icon" src="data:image/png;base64,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" />
                </IconButton>
            </form> : console.log()}
            <div className="extension_auth">
                <div className="inner_title">
                    <Button className="notify_icon" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickNoti}>
                        <NotificationsIcon />
                    </Button>
                    <span className="title" id="notify_title">
                        Thông báo
                        </span>
                </div>
                <Menu
                    id="menu_main_page"
                    anchorEl={openNoti}
                    keepMounted
                    open={Boolean(openNoti)}
                    onClose={handleCloseNoti}
                >
                    <p>Thông báo</p>
                    {
                        value.map(function (data, i) {
                            return <Link to={data.type} key={i}>
                                <MenuItem className="notifications_span">
                                    <span className="simple_menu_span">
                                        {data.number}{data.value}
                                    </span>
                                </MenuItem>
                            </Link>
                        })
                    }
                </Menu>
                <div className="inner_title">
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className="account_icon">
                        <img className="avatar_image" alt="avatar_image" src="demo.jpeg" />
                    </Button>
                    <span id="account_title" className="title">
                        Tài khoản
                        </span>
                </div>
                <Menu
                    id="menu_main_page"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleLogOut}>
                        <span className="simple_menu_span">
                            <ExitToAppIcon /> Đăng xuất
                            </span>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    )

}
export const NavbarRight = () => {
    let arr = window.location.href.split("/")
    return (
        <div className="navbar_right">
            <ul>
                <li className={arr[3] === "" ? "active_title inner_title" : "inner_title"}>
                    <Link to="/">
                        <div>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAABuklEQVRYhe2XMUvDQBiG3y9VBCnqopOLDhZHx4JYnRSc/QOKUh3bQUdHHRxV0OIP8B+IgjrpLopuFmKrtNqStFja5M6pUO2l5pKaRMiz5bu8+R7ujuMChISEdISsBsYPtWVwSnMgBiDiokcJHOcNJZJS1/tfuiI4tq+tgCjjQkrEU6MWnVJT9CkTUoRVonRXlL4T6+2rLMqGxILAhEsZq26T8hExbvacJcTkv2slGBhCQbeIj5kDnf9FM6NQfKip2fuWkknEnwyGzEdmTvVdsJ7Po/6aEw2VFaKZt6PE3c+BoCzxEON8TzQQFEEAiIuKQRKMioqeCnLGpDOeCrKqLp3xTLDxXoRZrUrnemy+pwE4az6Yuh7npjFqJ8gNE6auwSiXpOUAe4IaB5t/3hi8bRaGV69OASw56ijJb0vcJuc1nQR9lwOsBQMhB1jsQabwhWyygxxxBm75v9VVhDOYTQ7cdAoR8Pg3Ou04OgeZ0XsEwNm5IYkjweLJdE4hSnDgAkCly07f8GYjCRhevd4E+E5rrXA82+bj222mcJzYBWjrt/d8vW7ZkfT9Pmh3Jn1nZO1y22+HkJB/yRf9bo6qW/CI/QAAAABJRU5ErkJggg==" />
                            <span >
                                Tin nhắn
                        </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "news" ? "active_title inner_title" : "inner_title"}>
                    <Link className="home_icon icon_nav" to="/news">
                        <div>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAFLklEQVRYhe3Ye0xTVxwH8O/v9DLKQzTxOZc4N0FgPiZCgfKSYDUr4FTaolvc5lDU6RZl+MJkerOZJf4x3ZaYRY1/afxj8A9LptuCj0wWl4FT29IWioogIvEBFIFp8Z79AcW+Kc/tD79Jk96TnnM/+Z3cX84t8DIv8zJ+IxuLRVVqTdysqFihod5sG+labDRAzlHlaArAqDqIyYxLV+QpRrreqAJVOZoCgE4QEePgExmX/Zq1Im/xSNYctS124GQyGR3Yt5NemzkDeqMphHG29o2YmPO368z3/jOgM25/STGlJCuwaOF8SJIEvdEkZ5zlz46ed+F2nal53IHLsrUbQXTcUbmUZAU45yAiLFo4H3a7HUaTRU4EXWTUvIqbVlPLuAGXZWs3csIxB06ZlICmu83YWrSH/1V1jVKViUhKWNyHrLHIOSF/qMhhA1U5mgJH5Rzb2nT3HnaWiPzho8fUcr8VBqMJGelKJCUshiRJMBjNchCtnT038O0eFlCVqykEXLe1sakZO0sO8Lb2DlqZ+w6CBAE15loYaszISFNCER/nqGQwEXRzImPP37IO/uAMGbg0R7eB0LetLpXbJ/K29g7KW5mDbZsLkJmeClM/0GA0ISNNiSTFi0oSYwFVckjAPhz32NbikgO8ra2dNKty8UnhegCAIAjISFN6IBXxcY6nO5gRrYmMjL1402r2iQwYGAhuy8aPXOa4I/WGGixJS3FBgrF8f8iAgH2tBG64ZhSXiD5x3pBGk2XIyEGBzq1kqLjRQPoFDobTBoDzhbx67QaWpKUgsb8F+UL6BAaC2xwgzhvSZKnD39f1gyK9Avv7nCdub1+fGw5uqMg358RculVvvusBVOVqCsHpmHMTbrjTiOISkbd32Chf8y42bfhwWDhnZHpaMgxGMyy1VuiNJmSkKpGY4NTMGcuPmht9zvM8yGkTAEpNVpAyKQG3G/pwHR02WqNZicKPPxgRzpEQuRy7irYBAMyWOuzdfxBdXd1Yt1aLaVOngHMe0ctZHrlPVGXrFoDhAjifol6ehT/+rOI2WyeFyuXflZed2u7tZvXtwOlawC55x0S8Any6EAgLch1vbX2AdRu2DlzHREdBHhyM63ojAFT2hpLao4IVZ0sNkJAFoofnfrsAm62TABwqLzsl+qrGzQ7A9gzo6fX+ae0GWrp9zQYAVAOotNRaXXCXSkufeD3yDyA59AR8VfFz2V6/y488T3pDSQ2gHMAvDhwACL5mVJwtNQB4e4xhA+kHrXIfD/il6f31W1ZfvaYfVVQgCRj44OGjH44eOzmWFq8Zymtn8DO7fcwgvhIQMCs77/WxhviKX6AoikyVoz3CiN0aL5B7/AIvVxv3ANgxaWKER0Mfr/gELl29ejIBOwRB4N9/8/X/B6jT6WTLsrWH6JnsHjimzYuNpldnTB+Tm/f80wMAICBUFEWvxfIYbOvhIifsDg8PC1Ivz8KmgtE5HLinxmTBjt1fAAA4kFhZZbyk1OlC3H8niKLIrlTfWMC5IEjS8yDiVMRkDJ9/toVmTJ8GALDW9z0jdnvvwHfntLYAPff9gxonADz8xfW3R0+gq6sbmekpaLjThIbGpvTwbuwC8CUAZK54b0pmfPRjUuVoDwMoGk4VRpqICROelp05efn3yiuTDx46EgcAnPPtz2WvnBEkezPAjwvEqJw/l2aCaNj/FTJ5WHjI1FlvAczrCZ1LvU+7W6zXIUkuB7LOTttPjLHTarU6GCzsMIhPIs4uZsZHP66sMhznoB//BcUl0FBd7bfCAAAAAElFTkSuQmCC" />
                            <span >
                                Trang chủ
                    </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "feedback" ? "active_title inner_title" : "inner_title"}>
                    <Link className="feedback_icon icon_nav" to="/feedback">
                        <div>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAADr0lEQVRYhe2YMWwcRRSGv5k9m4SgmDQHUuCEkgIpUhpS0hxNJArr7mQdFBGKnCCBaFCaCEGTdGkJkp0oRIgCRYplClxEQSAoACGlxGkoXDjK+pTCJiTEye3u/BS3lzvfztq34WIk8N/MvJl5b/99782b2YUd7GB41G7rbO22zo7Sph2pMcOUNUyN1GaRxVWp1GipnDcvw6Iz/JY332ipXJVKRZ5ZCLVQs/VQd2otHS6s29Lheqg79VAzRfQKedAYvgH2GvFJIXZAqrMXw0JR3UKohzrSXNVEUb3mqibqoY48DU7/KkzeRGX+xAESuw+i3mC0cU1ElBnrrYuyKlFmBCKIXLB299T80tAEX5k7eQH0niQkQEJS2mblXl/gk+nJefYcmr374cIHg1xyNommt5OcJIzTSR8TL0FJ49tJLpXHfVy8RdNLpp3g2tEAucHWT44Be4wFEJjsy+YRPHhl+uUoCMqPE9hl3/Slsef5+fh5AvPPTsdEjtdmT7AcrWYi4SV48Ov3y3HSXjJKSpLNDcO9eJ2F33/BGkvHJV1393XUP9MT1CcncvzZfgB40sQDgzCVuekriLc3zREnXOQ2zTl8OYfHngVhMvr3Tl/LVBWLQcvcP4b01aYbIhEkCYpjiLtt3JOTTt/FMS6dd3GMogQXORQ5JNfJPQ+5fA92cbUZVOJdXzqZY77dWnbP8sWbpzeG2GOzP5yDmPl1nqtLPyGDNxL3P7ru8WAXb80ly6WHx3EbPZnNkScj1wn3FqXJg+xJ8kO1tP/W/ihDLhGuHYNzQ9S5bqnqhi4ds4LA5ubwXx9/u4kHu3jjxzhDrkvGGGQt2AACi7EWUtlY2xkLuq2BAEwAWIPSzFCUDJSxPvse5BTqbBgmkmc4V32XwNgtS0mfoQ1VCCBxCaeufcYfrGciMTRBX448N7aLyVdfp2QDr8qwiF3Cme8vs/boQfbEGZagL0dura/y4vmp3OPLW5rS/Otfj4RKnTTI5PCwBL1FeMxgS6UMOZMaNwMyj/vC5OX0wAbzIe82097K2KhvOcCjoQkacXmbyWGkz71cvH4FXpiZOpCM2X251/R+wbMEIIp83wPAwLhzwdrDM995r/z/PdRWdOhoS3uK6h1taU9tRYeK6hW6fdZXVDXixm7HxaIP2u24aMSN+oqqRfSKXo/fAdqB4dOCeqQ67dTG00HzpsYnQ1Xy5huhLjVCXcqbnwxVad6U9+NoW9AItdgItThKmyP9FSa4Pkp7O/hf4G8ClYGTqswhlAAAAABJRU5ErkJggg==" />

                            <span>
                                Góp ý và cải thiện
                    </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "help" ? "active_title inner_title" : "inner_title"}>
                    <Link className="contact_icon icon_nav" to="/help">
                        <div>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAFBElEQVRYhe3YW2wUVRgH8P+Znd1ut1CkXNpyaekFRakxgsWgJSIRo4hRQiVGE0MxhgQT31BCIvHBRPHZF6OhqJEHQESNBAIVkyIP1ggJxOC2lbKYVoSyly5rd2fO9/dht9222+nutMUHwnmZnMnMOb85t++cAe6mOzypqbz86LH+0qRXraFGAyHVFMwSAoqIUnBFyIuW12jv2jAn9r8B156mGdXhZojaRnAdBR6SIAGSAAFKNk/CJthGYWtQlx/GFqVvG/CRU5FmAfeSqCUJyjDCCYeRz4HohsjbnS8vODKtwNXHo2UpE/sIeWFspS5w2fvCb2xar4derQ5PGbjidLReCU+QrJ0mHEhAyC6x9TNXt1Z1TxqYwbWTrJhO3FAeVH0i9pqJkI7A1cejZSkvO6a75bK4zD2gy0OrsaelJjKew3ACpkzsKwgnAhlMwEjEMNeKYoGOwT8YgSTiECs5MS59rbfE/MxVC65si7xE8mA+nBpM4Ml5Cq/cNxsr5pfA58kWF4olcfDSTXz6exyWtwQEcnEjWheCTb3bq47mBa49TTOmI38UspTUqhi+f77W6eMBAGf/GsBrJ6/B9gYccWk4O/tmV90/dp3M6eKoDjcXus6BE9oAAI8tmomNi3yA1o64TH5pRX9o89j3c8egqG2FTggQEAI/dIfxxokerD/cieZvu3Gp/99RRT6xuARia0fc0GQSYctYzqguXnny5ixN9BcQvkAS860YKgIGzkU9gOkFYYBa4/HSFL7YWDNc7sk/I9jW1g+YRY64dIPA5q3BshvvLBsYtwU10FQojgL02V6cTxQD3qI0LvNcsTl6aIeiKVB58uAIkqYO+Jscu5iCB92sc8rrB6GyFQvhS93CjofnjQIeDUYBZeTBDd2XBmeglupJL8Ii8FsD2P90JR4qLxkus/X8P/gtDJAqL44EIFwy0mSOAgIzJxshzGQcXz67ECsrZwyXd+Didew5exPwlRSEoxAgSp2BMnR1GfitFLYvLx2F+7ijDx92xEBvwA0u3YpOXQyFgUnFVtvCc3X3DBdzrDOMD34dAH2BzBgtFEeQiDkCqdHjGkeAWlBWnO2M493R7JLiDgcRXnbsYhG5AMAVLh1NFDp642iYHwAA+AyAIqBSrnAkoaAuOgItn+eMmdQ2SdPNlgleP7a3XYdIOrQQCvAWucZRYBXB/tmxi7s2zImR/NHVfo5Ig0wfqDVE26AyACq3OIA4NTKK5E4SACT3ucJlJsn6eTbOtyxFz5sPYE/jDEgy4QqXybeO9eQAg7r8MIiugnEEJDmI99dVoXyGF37TwI5VlagJiEucCsbr6nNOe7m7mS1Kg7KrUFx6227gWjw1XERKE5Fk7u5lgpYDqXeOd2Z2PJPUHug9QmJTXhwBisZCI4G3GueirNjE5+du4Ke/FegxC8KBOHRr971bxnM4Aqu+ujJb0fwFRP2EuKHxKgJaNkhJ71yUUSCOQZ9hrgrvqou6AgLA4v2hOsMw2ylSOSHO5Wwdke8VzabBd5dddjI4nuoA4OrWqm4Rew0x/qSZCg5kMB8uL3AI6aHVSOLr6cPhkM8wV+XDAS5/Hi34JPQiwY9ILJ0cTgVJvTOxe9l3hdbp/v/gQXoq+kObRdhC4imSZr7wBeIUidZ4Xf2R2/r7bWyau/fSTB3wN4HSAOESaMwiBKQRFeoeReNCUSJ55vp7y+NTqeduuqPTf+NAArWFyy6YAAAAAElFTkSuQmCC" />
                            <span >
                                Trợ giúp
                    </span>
                        </div>
                    </Link>
                </li>
                <li className={arr[3] === "policy" ? "active_title inner_title" : "inner_title"}>
                    <Link className="policy_icon icon_nav" to="/policy">
                        <div>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAABbklEQVRYhe2YMUvDQBiG3xx3CdpaU0shkS5KdbSos4s46H/o7H9wEMEfIC5udekPcHKooKug4FaKRSeRVtKqtbZqkiZxEBdJwdxZaOWe9b733geOWz5A8s9R+h0YZ4cbBEEeAVgycd2ixNN5S5hHxtNvWg4APJ/Gqc1Y7mm2nTYWm3uXD2Xb84uN7bXSrwUzpcKUT1EDoAFASq/cKgiyvIJhZLs6DuY3sXtu4ajStDWqmndbK88/50hYuKf65rfcoGgxGwCQSWgAoDmuOx02Fyo4TEhBUaSgKJQn1Oua8N14pAxhHdBYPXIXl+B7YxnOy1ykjDp5g4nYceQuLsGx9BU0vRopQ1iHp4pPkOepeBn6TyIFRZGCokhBUaSgKFJQFCkoihQURQqKIgVFGU1B6pA6AHuQxUn3a3l237YB4ENlrBY213eBaZ4W1hUEeUBR/3qByRxGFx5nXlPGUmP/wio7Pb9o7aye8N4vGWk+ATeyYfdbVvrnAAAAAElFTkSuQmCC" />
                            <span >
                                Điều khoản và dịch vụ
                    </span>
                        </div>
                    </Link>

                </li>

            </ul>
        </div >
    )
}
