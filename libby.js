// canvas helper class
class Kanvas {
    constructor(w,h,parentContainer){
        //setup the canvas
        this.canvas = document.createElement('canvas')
        this.canvas.style.display = 'block'

        this.ctx = this.canvas.getContext('2d')

        let parent = document.querySelector(parentContainer) 
        || document.body

        if(parent instanceof Element  || parent instanceof HTMLDocument){
            parent.appendChild(this.canvas)
        } else {
            document.body.appendChild(this.canvas)
        }

        this.setSize(this.width,this.height)
    }
    setSize(w,h){
        if(arguments.length !== 2) throw 'FRAME.setSize() -> Both Width and Height must be supplied'
        
        this.canvas.width = w
        this.canvas.height = h

        this.width = w
        this.height = h

        return this
    }

    fitWindow() {
        //fits the window , and sets the offscreen to the same size
        this.setSize(window.innerWidth,window.innerHeight)
        return this
    }
    fitParent(){
        throw 'fitParent() not implemented'
    }

    clearAll(){
        this.ctx.clearRect(0,0,this.w,this.h)
        return this
    }

    hidePointer(){
        this.canvas.style.cursor = 'none'
        return this
    }
    showPointer(){
        this.canvas.style.removeProperty('cursor')
        return this
    }

    static multiline(ctx,x,y,textArr,spacing){
        // "multiline ctx text"
        for (let i = 0; i < textArr.length; i++) {
            ctx.fillText(textArr[i],x,(y+(
                spacing ? spacing : 10
            )*i))
        }
    }

    static clearContext(ctx){
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
    }
}





//constants
const radToDeg = 180.0 / Math.PI

const degToRad = Math.PI / 180.0

const twoPI = Math.PI * 2


//math helpers "quikk mafs"
const mafs = {
    randomRange(a,b){ // inclusive (a -> b)
        if(!(a || b)) throw 'REEE wrong in randomRange()'
        const max = Math.max(a,b || 0)
        const min = Math.min(a,b || 0)
        return  Math.floor(Math.random()*(max-min+1)+min)
    },

    randPosNeg() { // 1 or -1 random gen
        return Math.random() > .5 ? 1 : -1;
    },

    rand_CL(samples) { // Central Limit Theorem...
        let s = samples || 3;
        let sum = 0
        for (let i = 0; i < s; i++) {
            sum += Math.random()
        }
        return (sum / s)
    },

    rand_BM() { // box muller transform...
        let a = 0, b = 0
        while(a === 0) a = Math.random()
        while(b === 0) b = Math.random()
        let n = Math.sqrt(-2 * Math.log( a )) * Math.cos(twoPI * b)
        if ( n > 1 || n < 0 ) return rand_BM()
        return n
    },

    distance(x1,y1,x2,y2) {
        return Math.hypot(x1-x2,y1-y2)
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


//simple? vector class
class Vector{
    constructor(x,y){
        this.x = x || 0
        this.y = y || 0
        return this
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
        let h = {};
        h.rad = Math.atan2(this.y,this.x)
        h.deg = (h.rad * radToDeg) //+ (180 % 360)  -> gives 360 instead of +-180
        return h
    }

    setHeading(rad){
        let mag = this.mag()
        this.x = Math.cos(rad)
        this.y = Math.sin(rad)
        this.scale(mag)
        return this
    }

    rotate(rad){
        let cos = Math.cos(rad)
        let sin = Math.sin(rad)
        this.x = (this.x * cos - this.y * sin)
        this.y = (this.x * sin + this.y * cos)
        return this
    }

    dot(vec){
        return (this.x * vec.x + this.y * vec.y)
    }

    mag(){
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }

    random(){ // this is probably not actually "random.."
        this.x = Math.random() * 2 - 1
        this.y = Math.random() * 2 - 1
        return this
    }

    stop(){
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
        return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h)
    }
    centre(){
        return {
            x : this.x + this.w*.5,
            y : this.y + this.h *.5
            }
    }
}