export class Time
{
    public static t = 1;
    public static delta = 1;
    public static deltaTime() : number {
        return this.delta;
    }

    public static fixedDeltaTime(): number {
        return this.t / 10;
    }
}
