export class Debug {
    // Rigidbody
    static drawCollisionPoints: boolean = false;
    static drawMomentum: boolean = false;
    static useVerlet: boolean = true;

    // Forcefield
    static forceFields: boolean = false;
    static vectorField: boolean = false;
    static invertVectorField: boolean = false;
    static timeVariant: boolean = false;

    // Particle System
    static stepSize: number = 1;
    static drawTrajectories: boolean = false;
    static useRungeKuttaSolver: boolean = false;

    // Mass-Spring
    static drawForce: boolean = false;
    static drawForceColor: boolean = false;
    static drawMassSpringGraph: boolean = false;
}
