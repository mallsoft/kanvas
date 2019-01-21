/**
 * @version 0.2
 */

// canvas helper class
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
    setSize(w,h){
        if(arguments.length !== 2) throw '.setSize() -> both Width and Height must be supplied'

        this.canvas.width = this.width = w
        this.canvas.height = this.height = h

        return this
    }

    fitWindow() {
        //fits the window , and sets the offscreen to the same size
        return this.setSize(window.innerWidth,window.innerHeight)
    }
    fitParent(){
        let p = this.parentContainer.getBoundingClientRect()
        return this.setSize(p.width,p.height)
    }

    clear(){
        this.ctx.clearRect(0,0,this.width,this.height)
        return this
    }

    //hide show the vanilla cursor ...so you can add your own!
    hidePointer(){
        this.canvas.style.cursor = 'none'
        return this
    }
    showPointer(){
        this.canvas.style.removeProperty('cursor')
        return this
    }

    fps(timeStamp){
        let dt = timeStamp - this._historicTime
        this._historicTime = timeStamp
                
        return Math.floor(1000 / dt) || 0
    }

    static arrText(textArr,x,y,context){
        //multiline text
        let fontSize = context.font.split('px')[0]

        for (let i = 0; i < textArr.length; i++) {
            context.fillText(textArr[i],x,(y+(
                fontSize
            )*i))
        }
    }


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

    rotate(rad){
        let mag = this.mag()
        let cos = Math.cos(rad)
        let sin = Math.sin(rad)
        this.x = (this.x * cos - this.y * sin)
        this.y = (this.x * sin + this.y * cos)
        this.normalize().scale(mag)
        return this
    }

    dot(vec){
        return (this.x * vec.x + this.y * vec.y)
    }

    mag(){
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }

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

    get speed(){
        return this.moveTimer > 1 ? this._speed : 0
    }

    get vector(){
        let r = this._historic.pos.angleTo(this)
        let mag = this.copy().sub(this._historic.pos).mag()
        return new Vector(
            Math.cos(r) * mag,
            Math.sin(r) * mag
            )
    }

} 

/**
 * TODO ?
 * - change color (set)
 * - change hue
 * - saturation
 * - brightness
 * 
 * - random color
 * - invert?
 * 
 */
class Color{
    constructor(colorHsla){
        this._color = colorHsla
    }
    
    copy(){
        return new Color(this._color)
    }

    get color(){
        let h = this._color.h,
        s = this._color.s,
        l = this._color.l,
        a = this._color.a
        return `hsla(${h},${s}%,${l}%,${a})`
    }

    get hue(){
        return this._color.h
    }
    get saturation(){
        return this._color.s
    }
    get lightness(){
        return this._color.l
    }
    get alpha(){
        return this._color.a
    }

    set color(colorHsla){
        //add a check?
        this._color = colorHsla
    }

    set hue(h){
        //0 - 360
        this._color.h = h
    }
    set saturation(s){
        //0 - 100% ...0 = no color (grayscale)
        this._color.s = s
    }
    set lightness(l){
        //0 - 100% ..0 = black
        this._color.l = l
    }
    set alpha(a){
        // 0.0 - 1.0 ...0 = opaque
        this._color.a = a
    }
}