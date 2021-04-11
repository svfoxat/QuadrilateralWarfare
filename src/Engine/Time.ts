export class Time
{
    public static t = 1;
    public static deltaTime() : number {
        throw new Error("NOT IMPLEMENTED!!!!!");
    }

    public static fixedDeltaTime(): number {
        return this.t / 10;
    }
}
