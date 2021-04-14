import * as PIXI from "pixi.js";
import {Gameobject} from "./Gameobject";

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
    private interactionManager: PIXI.interaction.InteractionManager;

    private mouseDownedObjects: Array<Gameobject> = [];

    public Mouse: any = {};
    public Keyboard: any = {};
    public MouseWheel: WheelEvent;
    public currPos: {x: number, y: number};

    private constructor(renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer) {
        this.renderer = renderer;
        this.interactionManager = this.renderer.plugins.interaction;

        this.registerEventsOnGameobjects();
        this.initListeners();
    }

    private registerEventsOnGameobjects() {
        this.interactionManager.on("mousemove", (e) => {
            this.currPos = e.data.global;
        })

        this.interactionManager.on("mousedown", (e) => {
            this.Mouse.clicked = true;
            if(e.target) {
                const gameobject = e.target.spriteRenderer.gameObject;
                gameobject.OnMouseDown();
                this.mouseDownedObjects.push(gameobject);
            }
        })

        this.interactionManager.on("mouseup", (e) => {
            this.Mouse.clicked = false;
            while (this.mouseDownedObjects.length > 0) {
                this.mouseDownedObjects.shift().OnMouseUp();
            }
        })
    }

    private initListeners() {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            this.Keyboard[e.key.toUpperCase()] = true;
            this.Keyboard[e.key.toLowerCase()] = true;
            setModifierKeys(e);
        })
        window.addEventListener("keyup", (e: KeyboardEvent) => {
            this.Keyboard[e.key.toUpperCase()] = false;
            this.Keyboard[e.key.toLowerCase()] = false;
            setModifierKeys(e);
        })
        window.addEventListener("mousewheel", (e: WheelEvent) => this.MouseWheel = e);

        const setModifierKeys = (e: KeyboardEvent) => {
            this.Keyboard["alt"] = e.altKey;
            this.Keyboard["ctrl"] = e.ctrlKey;
            this.Keyboard["shift"] = e.shiftKey;
        }
    }
}
