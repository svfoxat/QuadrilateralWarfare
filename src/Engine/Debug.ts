import {SceneManager} from "./SceneManager";
import {Forcefield} from "./Forcefield";

export class Debug {
    // Rigidbody
    static drawCollisionPoints: boolean = false;
    static drawMomentum: boolean = false;

    // Particle System
    static stepSize: number = 1;
    private static forceFieldsEnabled: boolean = false;
    static toggleForceFields = () => {
        if (!Debug.forceFieldsEnabled) {
            Forcefield.DrawForceField(SceneManager.getInstance().activeScene)
            Debug.forceFieldsEnabled = true;
        }
        else {
            Forcefield.UndrawForceField(SceneManager.getInstance().activeScene)
            Debug.forceFieldsEnabled = false;
        }
    }
    static drawTrajectories: boolean = false;
    static useRungeKuttaSolver: boolean = false;

    // Mass-Spring
    static drawForce: boolean = false;
    static drawForceColor: boolean = false;
    static drawMassSpringGraph: boolean = false;
}
