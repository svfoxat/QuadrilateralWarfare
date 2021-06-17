import React, {useEffect, useRef, useState} from "react"
import SceneHierarchy from "./SceneHierarchy";
import EngineControls from "./EngineControls";
import { makeStyles } from '@material-ui/core/styles';
import Inspector from "./Inspector";
import Application from "../Engine/Application";

const useStyles = makeStyles({
    debug: {
        display: "flex",
    },
});

export default () => {
    let app: Application = window["app"];
    const styles = useStyles();
    const [connected, setConnected] = useState<boolean>(false)
    const [selectedNodeId, setSelectedNodeId] = useState<string>(null);

    useEffect(() => {
        (async() => {
            while(!window.hasOwnProperty("app"))
                await new Promise(resolve => setTimeout(resolve, 100));
            setConnected(true);
        })();
    }, [])

    const handleNodeSelection = (node: any) => {
        setSelectedNodeId((prevId) => {
            node.selected = true;

            if (prevId) {
                let go = app.activeScene.getGameobjectById(prevId);
                if (go) {
                    go.selected = false;
                }
            }

            return node.id
        });
    }

    return (
        <div className={styles.debug}>
            {connected &&
            <>
                <EngineControls />
                <SceneHierarchy onSelectNode={handleNodeSelection} app={app}/>
                {selectedNodeId && <Inspector app={app} selectedNodeId={selectedNodeId}/>}
            </>
            }
        </div>
    )
}
