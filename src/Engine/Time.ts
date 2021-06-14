export class Time {
    public static t = 1;

    public static delta = 1;
    public static elapsedMS = 1;

    public static animationDelta = 1;
    public static animationElapsedMS = 1;

    public static realTime = 0;

    public static deltaTime(): number {
        return this.delta;
    }

    public static fixedDeltaTime(): number {
        return this.t / 100;
    }
}
