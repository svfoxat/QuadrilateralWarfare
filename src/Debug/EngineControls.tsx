import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        height: "500px",
        width: "25%",
        padding: "20px",
    },
    slider: {
        marginTop: "30px"
    }
});


export default () => {
    const styles = useStyles();
    const [targetFPS, setTargetFPS] = useState<number>(window["app"].desiredFPS);
    const [targetTimestep, setTargetTimestep] = useState<number>(window["app"].desiredT);

    useEffect(() => {
        window["app"].SetMaxFPS(targetFPS)
        window["app"].SetAnimationT(targetTimestep);
    }, [targetFPS, targetTimestep])

    const handleChangeT = (e: any, value: number) => {
        setTargetTimestep(value);
    }

    const handleChangeFPS = (e: any, value: number) => {
        setTargetFPS(value)
    }

    return (
       <div className={styles.root}>
           <h2>Engine Controls</h2>
           <Typography id="fps-slider" gutterBottom>
               Target FPS
           </Typography>
           <Slider
               className={styles.slider}
               defaultValue={targetFPS}
               aria-labelledby="fps-slider"
               valueLabelDisplay="on"
               step={10}
               value={targetFPS}
               onChange={handleChangeFPS}
               marks
               min={1}
               max={240}
           />

           <Typography id="fps-slider" gutterBottom>
               Target Timestep
           </Typography>
           <Slider
               className={styles.slider}
               defaultValue={targetTimestep}
               aria-labelledby="fps-slider"
               valueLabelDisplay="on"
               value={targetTimestep}
               onChange={handleChangeT}
               step={0.1}
               marks
               min={0}
               max={10}
           />
       </div>
    )
}
