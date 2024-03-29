import { Projectile } from "./projectile.model";
import {GameObject} from "./game-object.model";
import {GameComponent} from "../game.component";
import {Explosion} from "./explosion.model";
import {GameConfig} from "../game-config";
import { ImageObject } from "src/app/drag-and-drop/model/image/image-object";

export class SpaceObject extends GameObject {
    public x: number;
    public y: number;

    public width: number;
    public height: number;

    public detected: boolean;
    public projectile: Projectile;

    private velocityX: number;
    private velocityY: number;
    private angle: number;

    private image: HTMLImageElement;

    public imageObject: ImageObject;

    public action: number = 0; //0: shoot, 1: collect, 2: fly by

    constructor(game: GameComponent, x: number, y: number, velocityX: number, velocityY: number, imgO: ImageObject, width: number, height: number){
        super(game);

        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.angle = Math.atan2(this.y - this.game.truck.y, this.x - this.game.truck.x);
        this.image = new Image();
        this.image.src = imgO.imagePath;
        this.imageObject = imgO;
        this.width = width;
        this.height = height;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, (this.x-this.width/2), (this.y-this.height/2), this.width, this.height);

        if (this.detected) {
            ctx.beginPath();
            ctx.rect(this.x-0.5*this.width, this.y-0.5*this.height, this.width, this.height);
            ctx.strokeStyle = this.getActionColor();
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.font = "16px Mono";
            ctx.fillStyle = this.getActionColor();
            const msg = this.imageObject.label || '';
            ctx.fillText(msg, this.x-0.5*this.width, (this.y-0.5*this.height)-10);
            ctx.stroke();
        }

        if (this.projectile) {
            this.projectile.draw(ctx);
        }
    }

    private getActionColor(): string {
      switch (this.action) {
        case 0:
          return '#e63946';
        case 1:
          return '#90be6d'
      }
      return '#717171';
    }

    public update(delta: number): void {
        this.x = this.x + this.velocityX + this.velocityX * delta * 0.03;
        this.y = this.y + this.velocityY + this.velocityY * delta * 0.03;

        const range = GameConfig.radarRange + GameConfig.spaceObjectSize / 3;
        const dist = Math.hypot(this.game.truck.x - this.x, this.game.truck.y - this.y);
        if (this.projectile){
            this.projectile.update(delta);
            if (this.hitProjectile()) {
                this.checkDemage();
                this.game.spawnObject(new Explosion(this.game, this.x, this.y));
                this.active = false;
            }
        } else if (dist > range) {
            this.detected = false;
        } else if (
            dist < range
            && this.angle > this.game.radarAngle-0.1 && this.angle < this.game.radarAngle+0.1
            && !this.detected
        ){
            this.detected = true;
            if (this.action === 0){
                const vx = Math.cos(this.angle) * 6;
                const vy = Math.sin(this.angle) * 6;
                this.projectile = new Projectile(this.game, this.game.truck.x, this.game.truck.y, vx, vy);
            }
        } else if (this.isOutOfBounds()) {
            this.active = false;
        }

        if (this.hitTruck()) {
            this.checkDemage();
        }
    }

    private isOutOfBounds(): boolean {
        return(this.x < (0-this.width)
            || this.y < (0-this.height)
            || this.x > (this.game.width+this.width)
            || this.y > (this.game.height+this.height));
    }

    private checkDemage(): void {
        const demage = this.game.demage[this.imageObject.labeledClass][this.action];
        if(demage === 0) {
            if(this.action === 1) {
                this.active = false;
            }
        } else {
            this.active = false;
            if(!this.imageObject.custom) {
                this.game.truck.health -= demage;
                this.game.applyShake();
                const dmg: ImageObject[] = JSON.parse(localStorage.getItem('analytics-hits') || '[]');
                dmg.push(this.imageObject);
                localStorage.setItem('analytics-hits', JSON.stringify(dmg));
                const actions: Number[] = JSON.parse(localStorage.getItem('analytics-actions') || '[]');
                actions.push(this.action);
                localStorage.setItem('analytics-actions', JSON.stringify(actions));
            }
        }
    }

    public hitTruck(): boolean {
        const dist = Math.hypot(this.x - this.game.truck.x, this.y - this.game.truck.y);
        return (dist < this.game.truck.height/2);
    }

    public hitProjectile(): boolean {
        const dist = Math.hypot(this.x - this.projectile.x, this.y - this.projectile.y);
        return dist < 70;
    }
}
