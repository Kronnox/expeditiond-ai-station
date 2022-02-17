import {GameObject} from "./game-object.model";
import {GameComponent} from "../game.component";

export class Particle extends GameObject {

    private x: number;
    private y: number;
    private radius: number;
    private hue: number;
    private gravity: number;
    private opacity: number;

    private velocityX: number;
    private velocityY: number;

    constructor(game: GameComponent, x: number, y: number) {
        super(game);

        this.x = x;
        this.y = y;
        this.radius = Particle.rand(7, 2, true);
        this.hue = Particle.rand(50, 0, true);
        this.gravity = 0;
        this.opacity = Math.random() + .2;

        this.velocityX = Math.random() * 14 - 7;
        this.velocityY = Math.random() * 14 - 7;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "hsla(" + this.hue + ",100%,50%,"+this.opacity+")";
        ctx.fill();
    }

    public update(): void {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;

        this.hue -= 0.2;
        this.radius = Math.abs(this.radius - .3);

        // reset particle
        if(this.radius <= .05) {
            this.active = false;
        }
    }

    private static rand(max: number, min: number, toInt: boolean): number {
        const realMax = (max === 0 || max) ? max : 1;
        const realMin = min || 0;
        const res = realMin + (realMax - realMin) * Math.random();

        return toInt ? Math.round(res) : res;
    };
}
