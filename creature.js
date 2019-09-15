class creature {
  constructor(position, others, maxDistance) {
    this.neighbours = this.findNeighbours(others, maxDistance);
    this.pos = position;
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.rad = 2;
    this.maxDist = maxDistance;
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.others=others;
  }

  findNeighbours(others, maxDist) {
    //console.log(maxDist);
    let l = others.length;
    let neigh = [];
    for (let i = 0; i < l; i++)
      if (p5.Vector.sub(others[i].pos, this.pos).mag() < maxDist) neigh.push(others[i]);
    return neigh;
  }

  show() {
    push();
    fill(255, 0, 0);
    beginShape();
    translate(this.pos.x,this.pos.y);
    rotate(this.vel.heading()+3*PI/2);
    vertex( - this.rad,- this.rad);
    vertex(0,  2 * this.rad);
    vertex( this.rad,  - this.rad);
    endShape(CLOSE);
    pop();
    //this.showRadius();
  }

  update() {
    this.neighbours=this.findNeighbours(this.others,this.maxDist);
    let target = createVector(this.pos.x,this.pos.y);
    //target.add(createVector(1,1));
    target.add(this.separation().mult(20));
    target.add(this.cohesion().mult(1));
    target.add(this.alignment().mult(1));
    this.applyForce(this.steerTowards(target));
    //this.steerTowards(target);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.respawn();
  }

  showRadius() {
    noFill();
    circle(this.pos.x, this.pos.y, this.maxDist);
  }

  separation() {
    let noNeighbours = 0;
    let target = createVector(0,0);
    for(let neighbour of this.neighbours){
      if (p5.Vector.sub(neighbour.pos,this.pos).mag()>this.maxDist/2) continue;
      noNeighbours++;
      target.add(neighbour.pos);
      target.sub(this.pos);
    }
    if(noNeighbours) target.normalize();
    target.mult(-1);
    return target;
  }
  alignment() {
    let noNeighbours = 0;
    let target = createVector(0, 0);
    for (let neighbour of this.neighbours) {
      noNeighbours++;
      target.add(neighbour.vel);
    }
    if (noNeighbours != 0) target.normalize();
    return target;
  }
  cohesion() {
    let noNeighbours = 0;
    let target = createVector(0, 0);
    for (let neighbour of this.neighbours) {
      target.add(neighbour.pos);
      target.sub(this.pos);
      noNeighbours++;
    }
     if (noNeighbours != 0) target.normalize();
    return target;
  }

  applyForce(force) {
    this.acc.add(force);
  }
  
  steerTowards(target){
    let desiredVel = createVector(target.x,target.y);
    desiredVel.sub(this.pos);
    let acc = createVector(desiredVel.x,desiredVel.y);
    acc.sub(this.vel);
    acc.limit(0.1);
    return acc;
  }
  
  respawn(){
    if(this.pos.x<-10) this.pos.x=width+10;
    if(this.pos.x>width+10) this.pos.x=-10;
    if(this.pos.y<-10) this.pos.y=height+10;
    if(this.pos.y>height+10) this.pos.y=-10;
  }
}