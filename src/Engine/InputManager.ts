import * as PIXI from "pixi.js";

export class InputManager {
    private static instance: InputManager;
    public static initialize(renderer:  PIXI.CanvasRenderer | PIXI.WebGLRenderer) {
        this.instance = new this(renderer);
    }
    public static getInstance(): InputManager {
        if (!this.instance)
            throw new Error("Initialize me first!");
        else
            return this.instance;
    }

    private readonly renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
    public Mouse: PIXI.interaction.InteractionManager;
    public currPos: {x: number, y: number};
    private constructor(renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer) {
        this.renderer = renderer;
        this.Mouse = this.renderer.plugins.interaction;

        this.currentMousePosition();
    }

    public currentMousePosition() {
        this.Mouse.on("mousemove", (e) => {
            this.currPos = e.data.global;
        })
    }
}
