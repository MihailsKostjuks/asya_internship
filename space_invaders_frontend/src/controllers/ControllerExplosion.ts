import {ControllerElement} from "./ControllerElement";

export class ControllerExplosion extends ControllerElement{
    life = 0.5;

    update(delta_time: number) {
        super.update(delta_time);
        this.life -= delta_time;
        if (this.life <= 0) {
            this.remove();
        }
    }
}
