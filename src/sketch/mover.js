import { Vector3 } from 'three';

export default class Mover {
    constructor({ initialPos, mass, acc, vel }) {
        this.mass = mass;
        this.acc = acc;
        this.vel = vel;

        this.pos = new Vector3(initialPos.x, initialPos.y, initialPos.z);
    }

    applyForce(force) {
        const newForce = force.clone().divideScalar(this.mass);
        this.acc.add(newForce);
    }

    getPosition() {
        this.vel.add(this.acc);

        const { x: addedX, y: addedY, z: addedZ } = this.pos
            .clone()
            .add(this.vel);
        this.pos.set(addedX, addedY, addedZ);
        this.acc.multiplyScalar(0);

        const { x, y, z } = this.pos;
        return { x, y, z };
    }
}
