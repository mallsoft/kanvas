/**
 * @version 0.2
 */


/**
 * canvas helper class
 * @param {Element} parentContainer html element, default is document.body
 * @param {number} w width of the canvas
 * @param {number} h height of the canvas
 */
class Kanvas {
    constructor(parentContainer,w,h){
        //setup the canvas
        this.canvas = document.createElement('canvas')
        this.canvas.style.display = 'block'
        this.canvas.className = this.constructor.name
        this.ctx = this.canvas.getContext('2d')

        this.parentContainer = document.querySelector(parentContainer) 
            || document.body
        
        if(this.parentContainer instanceof Element  
            || this.parentContainer instanceof HTMLDocument){

            this.parentContainer.appendChild(this.canvas)

        } else {
            document.body.appendChild(this.canvas)
        }
        
        this.width = w || 640
        this.height = h || 480

        this.setSize(this.width,this.height)
    }

    /**
     * Set the dimension of the canvas
     * @param {number} w width
     * @param {number} h height
     */
    setSize(w,h){
        if(arguments.length !== 2) throw '.setSize() -> both Width and Height must be supplied'

        this.canvas.width = this.width = w
        this.canvas.height = this.height = h

        return this
    }

    /**
     * Sets canvas dimensions to window dimensions
     */
    fitWindow() {
        //fits the window , and sets the offscreen to the same size
        return this.setSize(window.innerWidth,window.innerHeight)
    }

    /**
     * Sets canvas dimensions to parent element dimensions
     * - note, if the parent is automatically sized this will not work
     */
    fitParent(){
        let p = this.parentContainer.getBoundingClientRect()
        return this.setSize(p.width,p.height)
    }

    /**
     * Clears the canvas context
     */
    clear(){
        this.ctx.clearRect(0,0,this.width,this.height)
        return this
    }

    /**
     * Hide the pointer
     */
    hidePointer(){
        this.canvas.style.cursor = 'none'
        return this
    }
    /**
     * Show the pointer
     */
    showPointer(){ 
        this.canvas.style.removeProperty('cursor')
        return this
    }

    /**
     * @param timeStamp 
     * @returns an aproximation of frames per second
     */
    fps(timeStamp){
        let dt = timeStamp - this._historicTime
        this._historicTime = timeStamp
                
        return Math.floor(1000 / dt) || 0
    }

    /**
     * multiline text
     * @param {array} textArr 
     * @param {number} x 
     * @param {number} y 
     * @param context 
     */
    static arrText(textArr,x,y,context){
        let fontSize = context.font.split('px')[0]

        for (let i = 0; i < textArr.length; i++) {
            context.fillText(textArr[i],x,(y+(
                fontSize
            )*i))
        }
    }

    /**
     * Clear a spesific ctx
     * @param {ctx} ctx 
     */
    static clearContext(ctx){
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
    }
}

//math helpers "quikk mafs"
const mafs = {
    randomRange(a,b){ // inclusive (a -> b)
        const max = Math.max(a,b || 0)
        const min = Math.min(a,b || 0)
        return  Math.floor(Math.random()*(max-min+1)+min)
    },

    flip() { //gives 1 or -1
        return Math.random() > .5 ? 1 : -1;
    },

    rand_CL(samples) { // Central Limit
        let s = samples || 3;
        let sum = 0
        for (let i = 0; i < s; i++) {
            sum += Math.random()
        }
        return (sum / s)
    },

    rand_BM() { // box muller
        let a = 0, b = 0
        while(a === 0) a = Math.random()
        while(b === 0) b = Math.random()
        let n = Math.sqrt(-2 * Math.log( a )) * Math.cos((Math.PI*2) * b)
        if ( n > 1 || n < 0 ) return this.rand_BM()
        return n
    },

    distance(x1,y1,x2,y2) {
        if(arguments.length === 2 && arguments[0].x){
            return this.distanceObj(arguments[0],arguments[1])
        }
        return Math.hypot(x1-x2,y1-y2)
    },

    manhattan(x,y,x2,y2){
        return Math.abs((x-x2) + (y-y2))
    },
    
    distanceObj(o1,o2) {
        return Math.hypot(o1.x-o2.x,o1.y-o2.y)
    },
    
    vecToAngle(y,x) {
        return Math.atan2(y,x)
    },

    angleTo(x1,x2,y1,y2) {
        return Math.atan2(y1-y2,x1-x2)
    },

    angleToObj(o1,o2) {
        return Math.atan2(o1.y-o2.y,o1.x-o2.x)
    },
}

class Vector{
    constructor(x,y){
        this.x = x || 0
        this.y = y || 0
        return this
    }
    
    toString(){
        return `vX = ${this.y}  vY = ${this.x}`
    }

    copy(){
        return new Vector(this.x,this.y)
    }

    neg(){
        this.x = -this.x
        this.y = -this.y
        return this
    }
    negX(){
        this.x = -this.x
        return this
    }
    negY(){
        this.y = -this.y
        return this
    }

    scale(scalar){
        this.x *= scalar
        this.y *= scalar
        return this
    }

    normalize(){
        const magSq = this.x*this.x + this.y*this.y
        if (magSq !== 0) this.scale(1 / magSq)
        return this
    }
    
    /**
     * Adds one vector to another
     * @param {Vector} vec 
     */
    add(vec){
        this.x += vec.x
        this.y += vec.y
        return this
    }

    sub(vec){
        this.x -= vec.x
        this.y -= vec.y
        return this
    }

    heading(){
        return Math.atan2(this.y,this.x)
    }

    setHeading(rad){
        let mag = this.mag()
        this.x = Math.cos(rad)
        this.y = Math.sin(rad)
        this.scale(mag)
        return this
    }

    /**
     * Rotates a vector relative to the given radian
     * @param {Radian} rad 
     */
    rotate(rad){
        let mag = this.mag()
        let cos = Math.cos(rad)
        let sin = Math.sin(rad)
        this.x = (this.x * cos - this.y * sin)
        this.y = (this.x * sin + this.y * cos)
        this.normalize().scale(mag)
        return this
    }

    /**
     * @return the dot product
     * @param {Vector} vec 
     */
    dot(vec){
        return (this.x * vec.x + this.y * vec.y)
    }

    /**
     * @return magnitude of vector
     */
    mag(){
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }

    /**
     * Gives a pseudorandom vector
     */
    random(){
        this.x = Math.random() * 2 - 1
        this.y = Math.random() * 2 - 1
        return this
    }

    distanceTo(vec){
        return Math.hypot(this.x-vec.x,this.y-vec.y)
    }

    angleTo(vec){
        // Math.atan2(o1.y-o2.y,o1.x-o2.x)
        return Math.atan2(vec.y-this.y,vec.x-this.x)
    }

    clear(){
        this.x = 0
        this.y = 0
        return this
    }
}

class Rectangle{
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    isInside(x,y){
        return (
            x > this.x 
            && x < this.x + this.w 
            && y > this.y 
            && y < this.y + this.h
            )
    }

    centre(){
        return {
            x : this.x + this.w * .5,
            y : this.y + this.h * .5
            }
    }

    drawOutline(ctx,lineWidth,color){
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.strokeRect(this.x,this.y,this.w,this.h)
    }

    drawFill(ctx,fill){
        ctx.fillStyle = fill
        ctx.fillRect(this.x,this.y,this.w,this.h)
    }
}

class Circle{
    constructor(x,y,radius){
        this.radius = radius
        this.x = x
        this.y = y
    }

    isInside(x,y){
        return this.radius > mafs.distance(this.x,this.y,x,y)
    }

    drawOutline(ctx,strokeStyle){
        ctx.strokeStyle = strokeStyle
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2)
        ctx.stroke()
    }
}

class MouseEvent extends Vector{
    constructor(){
        super(0,0)
        
        window.addEventListener('mousemove', e=> {
            this.x = e.clientX
            this.y = e.clientY
        })

        this._historic = {
            pos: this.copy(),
            time: null,
        }
    }

    update(t){
        //the distance of travel since last call
        const dist = this._historic.pos.distanceTo(this)

        //the delta time (now - then)
        //how much time sinc last call
        const delta = t - this._historic.time

        //calculate the _speed
        this._speed = dist * delta
        this.moveTimer = this._speed > 0 ? this.moveTimer+1 : 0 

        //set new historic values
        this._historic.time = t
        this._historic.pos = this.copy()
    }

    /**
     * returns the 'speed' (some number based on the movement of the mouse position)
     */
    get speed(){
        //wait two frames before actually starting 
        return this.moveTimer > 2 ? this._speed : 0
    }

    /**
     * returns the speed and direction as a vector
     */
    get vector(){
        let r = this._historic.pos.angleTo(this)
        let mag = this.copy().sub(this._historic.pos).mag()
        return new Vector(
            Math.cos(r) * mag,
            Math.sin(r) * mag
            )
    }

    get isMoving(){
        return (this.speed > 0)
    }

} 

/**
 * @param colorHsla hsla object {h: 0-360, s: 0-100...a: 0.0-1.0}
 */
class Color{
    constructor(colorHsla){
        let c = colorHsla || {h:0,s:0,l:0,a:1} //or black
        this.h = c.h
        this.s = c.s
        this.l = c.l
        this.a = c.a 
    }
    
    copy(){
        return new Color(this)
    }

    /**
     * returns the color in a hsla() string 
     */
    toString(){
        return `hsla(${this.h},${this.s}%,${this.l}%,${this.a})`
    }

    /**
     * randomizes all color values including alpha
     */
    randomize(){
        let r = mafs.randomRange
        this.h = r(360)
        this.s = r(100)
        this.l = r(100)
        this.a = r(1000) / 1000
        return this
    }

    get hue(){
        return this.h
    }
    get saturation(){
        return this.s
    }
    get lightness(){
        return this.l
    }
    get alpha(){
        return this.a
    }

    /**
     * @param hue 0 - 360 deg
     */
    set hue(h){
        this.h = h
    }
    
    /**
     * @param s saturation 0-100 %
     */
    set saturation(s){
        this.s = s
    }

    /**
     * @param l lightness 0 - 100%
     */
    set lightness(l){
        this.l = l
    }

    /**
     * @param a alpha 0.0 - 1.0
     */
    set alpha(a){
        this.a = a
    }
}