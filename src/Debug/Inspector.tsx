import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Gameobject} from "../Engine/Gameobject";
import Application from "../Engine/Application";
import {FormControl, Input, InputLabel, OutlinedInput, TextField} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "500px",
        width: "25%",
        padding: "5px",
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    parameterBox: {
        display: "flex",
    },
    parameterHeadline: {
        width: '100px',
        marginRight: '0px'
    }
}));

export default(props: IProps) => {
    const classes = useStyles();
    const [selectedNode, setSelectedNode] = useState<Gameobject>(null);
    const [, setTransform] = useState(null);

    useEffect(() => {
        const int = setInterval(() => {
            const g = props.app.activeScene.getGameobjectById(props.selectedNodeId);
            setSelectedNode(g)
            setTransform(g.absoluteTransform.position)
        }, 100)

        return () => {
            clearInterval(int)
        };
    }, [props.selectedNodeId])

    return (
        <div className={classes.root}>
            <h2>Inspector - "{selectedNode?.name}"</h2>

            <div>
                <h3>Transform</h3>
                <div className={classes.parameterBox}>
                    <h4 className={classes.parameterHeadline}>Position:</h4>
                    <TextField
                        type={"number"}
                        label="x:"
                        id="outlined-margin-dense"
                        className={classes.textField}
                        value={selectedNode?.absoluteTransform.position.x.toFixed(2)}
                        margin="dense"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        type={"number"}
                        label="y:"
                        id="outlined-margin-dense"
                        className={classes.textField}
                        value={selectedNode?.absoluteTransform.position.y.toFixed(2)}
                        margin="dense"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <div className={classes.parameterBox}>
                    <h4 className={classes.parameterHeadline}>Scale:</h4>
                    <TextField
                        type={"number"}
                        label="x:"
                        id="outlined-margin-dense"
                        className={classes.textField}
                        value={selectedNode?.absoluteTransform.scale.x.toFixed(2)}
                        margin="dense"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        type={"number"}
                        label="y:"
                        id="outlined-margin-dense"
                        className={classes.textField}
                        value={selectedNode?.absoluteTransform.scale.y.toFixed(2)}
                        margin="dense"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <div className={classes.parameterBox}>
                    <h4 className={classes.parameterHeadline}>Rotation:</h4>
                    <TextField
                        type={"number"}
                        label="x:"
                        id="outlined-margin-dense"
                        className={classes.textField}
                        value={selectedNode?.absoluteTransform.rotation.toFixed(2)}
                        margin="dense"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

interface IProps {
    app: Application
    selectedNodeId: string;
}
