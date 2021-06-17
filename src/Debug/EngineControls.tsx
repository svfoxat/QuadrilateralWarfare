import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import {FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Switch} from "@material-ui/core";

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
    const [stepSize, setStepSize] = useState<number>(window["app"].debug.stepSize);

    useEffect(() => {
        window["app"].SetMaxFPS(targetFPS)
        window["app"].SetAnimationT(targetTimestep);
        window["app"].stepSize = stepSize;
    }, [targetFPS, targetTimestep, stepSize])

    const handleChangeT = (e: any, value: number) => {
        setTargetTimestep(value);
    }

    const handleChangeFPS = (e: any, value: number) => {
        setTargetFPS(value)
    }

    const handleChangeParticleStepsize = (e: any, value: number) => {
        setStepSize(value)
    }

    const handleChangeToggle = (e: any) => {
        let app = window["app"];
        if (e.target.name === "forceFields") {
            app.debug.toggleForceFields();
        } else {
            app.debug[e.target.name] = !app.debug[e.target.name];
        }
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

           <Typography id="particle-stepsize" gutterBottom>
               Particlesystem Stepsize
           </Typography>
           <Slider
               className={styles.slider}
               defaultValue={targetFPS}
               aria-labelledby="particle-stepsize"
               valueLabelDisplay="on"
               step={10}
               value={stepSize}
               onChange={handleChangeParticleStepsize}
               marks
               min={1}
               max={240}
           />

           <h3>Toggle Visualizations</h3>
           <FormControl component="fieldset">
               <FormLabel component="legend">Rigidbody</FormLabel>
               <FormGroup>
                   <FormControlLabel
                       control={<Switch onChange={handleChangeToggle} name="drawCollisionPoints" />}
                       label="drawCollisionPoints"
                   />
                   <FormControlLabel
                       control={<Switch onChange={handleChangeToggle}  name="drawMomentum" />}
                       label="drawMomentum"
                   />
                   <FormLabel component="legend">Particle System</FormLabel>
                   <FormControlLabel
                       control={<Switch onChange={handleChangeToggle} name="forceFields" />}
                       label="forceFields"
                   />
                   <FormControlLabel
                       control={<Switch onChange={handleChangeToggle} name="drawTrajectories" />}
                       label="drawTrajectories"
                   />
                   <FormControlLabel
                       control={<Switch onChange={handleChangeToggle}  name="useRungeKuttaSolver" />}
                       label="useRungeKuttaSolver"
                   />
                   <FormLabel component="legend">Mass-Spring System</FormLabel>
                   <FormControlLabel
                       control={<Switch onChange={handleChangeToggle} name="drawForce" />}
                       label="drawForce"
                   />
                   <FormControlLabel
                       control={<Switch onChange={handleChangeToggle}  name="drawForceColor" />}
                       label="drawForceColor"
                   />
                   <FormControlLabel
                       control={<Switch onChange={handleChangeToggle} name="drawMassSpringGraph" />}
                       label="drawMassSpringGraph"
                   />
               </FormGroup>
               <FormHelperText>Be careful</FormHelperText>
           </FormControl>
       </div>
    )
}
