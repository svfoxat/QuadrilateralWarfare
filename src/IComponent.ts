export interface IComponent {
    name: string;

    OnEnable: () => void;
    Start: () => void;
    Update: () => void;
}
