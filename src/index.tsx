import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import {Game} from "./Game/index";
import DebugWindow from "./Debug/DebugWindow";


const App = () => {
    useEffect(() => {
        new Game();
    }, [])

    return (
        <>
            <div id={"app_container"}/>
            <DebugWindow/>
        </>
    )
}


ReactDOM.render( <App/>,
    document.getElementById('root'))
