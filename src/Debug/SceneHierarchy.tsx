import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles({
    root: {
        height: "500px",
        width: "25%",
        padding: "5px",
    },
});

export default(props: IProps) => {
    const classes = useStyles();
    const [tree, setTree] = useState<any>([]);

    useEffect(() => {
        setTree([...props.app.activeScene.sceneRoot.children])
    }, [props.app])

    return (
        <div className={classes.root}>
            <h2>Hierarchy - "{props.app.activeScene.name}"</h2>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                <TreeItem nodeId={"root"} label={"sceneRoot"}>
                    {tree.map((node, idx) => (
                        <TreeItem nodeId={idx} label={node.name || "Gameobject"}>
                            {node.children.map((sub_node, idx2) => (
                                <TreeItem nodeId={`${idx}-${idx2}`} label={sub_node.name || "Gameobject"}/>
                            ))}
                        </TreeItem>
                    ))}
                </TreeItem>
            </TreeView>
        </div>
    );
}

interface IProps {
    app: any
}
