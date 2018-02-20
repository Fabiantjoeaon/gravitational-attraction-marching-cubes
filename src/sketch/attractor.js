import { Vector3 } from 'three';

export default class Attractor {
    constructor({ initialPos, mass, gravConst }) {
        this.mass = mass;
        this.gravConst = gravConst;
        this.pos = new Vector3(initialPos.x, initialPos.y, initialPos.z);
    }

    attract(mover) {
        const force = new Vector3().subVectors(this.pos, mover.pos);
        const clampedForce = force.clone().clampLength(5, 25);
        const distance = clampedForce.length();

        force.normalize();

        const strength = this.gravConst * mover.mass / (distance * distance);
        force.multiplyScalar(strength);

        return force;
    }

    getPosition() {
        const { x, y, z } = this.pos;
        return { x, y, z };
    }
}
