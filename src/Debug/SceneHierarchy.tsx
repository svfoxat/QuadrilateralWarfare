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
            setTree(props.app.activeScene.sceneRoot.children.filter(g => !!g.id))
        }, 100)
    }, [])

    const handleSelection = (node: Gameobject) => {
        props.onSelectNode(node);
    }

    return (
        <div className={classes.root}>
            <h2>Hierarchy - "{props.app.activeScene.name}"</h2>
            <TreeView
                defaultExpanded={['root']}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                <TreeItem nodeId={"root"} label={`Root (${tree.length})`}>
                    {tree.map((node, idx) => (
                        <TreeItem nodeId={node.id} onClick={() => handleSelection(node)} label={`${node.name}, ${node.children.length} children`} >
                           {node.children.map((sub_node, idx2) => (
                                <TreeItem nodeId={sub_node.id} onClick={() => handleSelection(sub_node)}label={sub_node.name}>
                                    {sub_node.children.map((hawi, hawiIdx) => (
                                        <TreeItem nodeId={hawi.id} onClick={() => handleSelection(hawi)} label={hawi.name} />
                                    ))}
                                </TreeItem>
                            ))}
                        </TreeItem>
                    ))}
                </TreeItem>
            </TreeView>
        </div>
    );
}

interface IProps {
    app: Application,
    onSelectNode: (node: Gameobject) => void;
}
