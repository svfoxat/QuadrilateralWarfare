import React, {useEffect, useState} from "react"
import SceneHierarchy from "./SceneHierarchy";
import EngineControls from "./EngineControls";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    debug: {
        display: "flex",
    },
});

export default () => {
    const styles = useStyles();
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        (async() => {
            while(!window.hasOwnProperty("app"))
                await new Promise(resolve => setTimeout(resolve, 100));
            setConnected(true)
            console.log(window["app"])
        })();
    }, [])

    return (
        <div className={styles.debug}>
            {connected &&
            <>
                <EngineControls />
                <SceneHierarchy app={window["app"]}/>
            </>
            }
        </div>
    )
}
