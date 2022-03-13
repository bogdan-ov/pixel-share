export class Vector2 {
    x: number
    y: number
    
    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    set(x?: number, y?: number): Vector2 {
        this.x = x || 0;
        this.y = y || 0;

        return this;
    }
    add(vec: Vector2): Vector2 {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }
    addNum(x: number, y: number): Vector2 {
        return new Vector2(this.x + x, this.y + y);
    }
    sub(vec: Vector2): Vector2 {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }
    div(value: number): Vector2 {
        return new Vector2(this.x / value, this.y / value);
    }
    mul(value: number): Vector2 {
        return new Vector2(this.x * value, this.y * value);
    }

    copy(vec: Vector2): Vector2 {
        this.x = vec.x;
        this.y = vec.y;

        return this;
    }
    expand(): Vector2 {
        return new Vector2(this.x, this.y);
    }
    apply(func: (num:number)=> number): Vector2 {
        return new Vector2(func(this.x), func(this.y));
    }

    distance(vec: Vector2): number {
        return Math.sqrt((this.x - vec.x)**2 + (this.y - vec.y)**2);
    }
    normalize(): Vector2 {
        const vec = new Vector2(this.x, this.y);
        const a = Math.sqrt(vec.x**2 + vec.y**2);
        vec.x /= a;
        vec.y /= a;

        return vec;
    }
    clamp(min: Vector2, max: Vector2) {
        return new Vector2(
            clamp(this.x, min.x, max.x),
            clamp(this.y, min.y, max.y)
        );
    }
    toIndex(width: number): number {
        return (this.y) * width + (this.x);
    }

    static compare(vec1: Vector2, vec2: Vector2): boolean {
        return vec1.x == vec2.x && vec1.y == vec2.y;
    }
    static get zero(): Vector2 {
        return new Vector2();
    }
    static all(value?: number): Vector2 {
        return new Vector2(value || 1, value || 1);
    }
}
export function vec(x?: number, y?: number): Vector2 {
    return new Vector2(x, y);
}

export function clamp(value: number, min: number, max: number): number {
    if (value < min)
        return min;
    else if (value > max)
        return max;
    else
        return value;
}
export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
export function randomInt(min: number, max: number): number {
    return Math.round(random(min, max));
}
export function randomId(): string {
    return `${ randomInt(0, 9) }${ randomInt(0, 9) }${ randomInt(0, 9) }${ randomInt(0, 9) }`;
}
export function pointInsideArea(point: Vector2, areaPos: Vector2, areaWidth: number, areaHeight: number): boolean {
    return (
        point.x >= areaPos.x &&
        point.y >= areaPos.y &&
        point.x <= areaPos.x + areaWidth &&
        point.y <= areaPos.y + areaHeight
    )
}