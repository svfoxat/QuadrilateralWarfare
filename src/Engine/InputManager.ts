import * as PIXI from "pixi.js";
import {Gameobject} from "./Gameobject";
import {Point} from "pixi.js";

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

    public Mouse: IMouse = {};
    public Keyboard: IKeyboard = {};

    private constructor(renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer) {
        this.renderer = renderer;
        this.interactionManager = this.renderer.plugins.interaction;

        this.registerEvents();
        this.initListeners();
    }

    private registerEvents() {
        this.interactionManager.on("mousemove", (e) => {
            this.Mouse.currPos = e.data.global;
        })
        this.interactionManager.on("rightdown", (e) => {
            this.Mouse.rightClick = true;
            this.mouseDown(e);
        });
        this.interactionManager.on("rightup", (e) => {
            this.Mouse.rightClick = false;
            this.mouseUp(e);
        });
        this.interactionManager.on("mousedown", (e) => {
            this.Mouse.leftClick = true;
            this.mouseDown(e);
        });
        this.interactionManager.on("mouseup", (e) => {
            this.Mouse.leftClick = false;
            this.mouseUp(e);
        });
    }

    private mouseDown = (e) => {
        if(e.target) {
            const gameobject: Gameobject = e.target.spriteRenderer.gameObject;
            gameobject.OnMouseDown();
            this.mouseDownedObjects.push(gameobject);
        }
    }

    private mouseUp = (e) => {
        while (this.mouseDownedObjects.length > 0) {
            this.mouseDownedObjects.shift().OnMouseUp();
        }
    }

    private initListeners() {
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            e.preventDefault();
            this.Keyboard[e.key.toUpperCase()] = true;
            this.Keyboard[e.key.toLowerCase()] = true;
            this.setModifierKeys(e);
        })
        window.addEventListener("keyup", (e: KeyboardEvent) => {
            e.preventDefault();
            this.Keyboard[e.key.toUpperCase()] = false;
            this.Keyboard[e.key.toLowerCase()] = false;
            this.setModifierKeys(e);
        })
        window.addEventListener("mousewheel", (e: WheelEvent) => {
            this.Mouse.mouseWheel = e
        });
    }

    private setModifierKeys = (e: KeyboardEvent) => {
        this.Keyboard.alt = e.altKey;
        this.Keyboard.ctrl = e.ctrlKey;
        this.Keyboard.shift = e.shiftKey;
    }
}

interface IMouse {
    leftClick?: boolean;
    rightClick?: boolean;
    currPos?: Point
    mouseWheel?: WheelEvent;
}
interface IKeyboard {
    alt?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    [key: string]: boolean
}
