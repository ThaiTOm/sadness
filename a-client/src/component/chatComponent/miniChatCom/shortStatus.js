import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"

function ShortStatus() {
    const [data, setData] = useState([])
    const [start, setState] = useState(0)
    const [end, setEnd] = useState(5)
    useEffect(() => {
        axios.post("http://localhost:2704/api/news/get/shot")
    })
    return (
        <div className="shot">
            <div className="shot_header">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg"><path d="m8.75 17.612v4.638c0 .324.208.611.516.713.077.025.156.037.234.037.234 0 .46-.11.604-.306l2.713-3.692z" /><path d="m23.685.139c-.23-.163-.532-.185-.782-.054l-22.5 11.75c-.266.139-.423.423-.401.722.023.3.222.556.505.653l6.255 2.138 13.321-11.39-10.308 12.419 10.483 3.583c.078.026.16.04.242.04.136 0 .271-.037.39-.109.19-.116.319-.311.352-.53l2.75-18.5c.041-.28-.077-.558-.307-.722z" /></svg>
                    <span>Shots</span>
                </div>
                <Link className="tooltip" to="/create/shots">
                    <svg id="add-svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 477.867 477.867" xmlXspace="preserve">
                        <g>
                            <g>
                                <path d="M392.533,0h-307.2C38.228,0.056,0.056,38.228,0,85.333v307.2c0.056,47.105,38.228,85.277,85.333,85.333h307.2
			c47.105-0.056,85.277-38.228,85.333-85.333v-307.2C477.81,38.228,439.638,0.056,392.533,0z M443.733,392.533
			c0,28.277-22.923,51.2-51.2,51.2h-307.2c-28.277,0-51.2-22.923-51.2-51.2v-307.2c0-28.277,22.923-51.2,51.2-51.2h307.2
			c28.277,0,51.2,22.923,51.2,51.2V392.533z"/>
                            </g>
                        </g>
                        <g>
                            <g>
                                <path d="M324.267,221.867H256V153.6c0-9.426-7.641-17.067-17.067-17.067s-17.067,7.641-17.067,17.067v68.267H153.6
			c-9.426,0-17.067,7.641-17.067,17.067S144.174,256,153.6,256h68.267v68.267c0,9.426,7.641,17.067,17.067,17.067
			S256,333.692,256,324.267V256h68.267c9.426,0,17.067-7.641,17.067-17.067S333.692,221.867,324.267,221.867z"/>
                            </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
                    </svg>
                    <span className="tooltiptext">Tao tin</span>
                </Link>
            </div>
            <div className="shot_div">
                <img src="../../some1.webp"></img>
                <img src="../../some.webp"></img>
                <img src="../../some2.webp"></img>
                <img src="../../some3.webp"></img>
                <img src="../../some4.webp"></img>
            </div>
            <svg version="1.1" id="arrow" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512.008 512.008" xmlXspace="preserve">
                <path d="M306.219,45.796c-21.838-21.838-57.245-21.838-79.083,0s-21.838,57.245,0,79.083l77.781,77.803
	H53.333C23.878,202.682,0,226.56,0,256.015c0,29.455,23.878,53.333,53.333,53.333h251.584l-77.781,77.781
	c-21.838,21.838-21.838,57.245,0,79.083c21.838,21.838,57.245,21.838,79.083,0l202.667-202.667c4.164-4.165,4.164-10.917,0-15.083
	L306.219,45.796z"/>
                <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
        </div>
    )
}

export default ShortStatus
