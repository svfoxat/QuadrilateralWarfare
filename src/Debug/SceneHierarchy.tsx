import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {Gameobject} from "../Engine/Gameobject";
import Application from "../Engine/Application";

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
        setInterval(() => {
            setTree(props.app.activeScene.sceneRoot)
        }, 100)
    }, [])

    const handleSelection = (node: Gameobject) => {
        props.onSelectNode(node);
    }

    const renderTree = (nodes) => (
        <TreeItem onClick={() => handleSelection(nodes)} key={nodes.id} nodeId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    return (
        <div className={classes.root}>
            <h2>Hierarchy - "{props.app.activeScene.name}"</h2>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultExpanded={["ROOT"]}
            >
                 {renderTree(tree)}
            </TreeView>
        </div>
    );
}

interface IProps {
    app: Application,
    onSelectNode: (node: Gameobject) => void;
}
