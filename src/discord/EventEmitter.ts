export class EventEmitter<T extends {
    [key: string]: [...any] | any[]
}> {
    protected subscribers: Map<keyof T, ((...args: any) => void)[]> = new Map()

    on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): this {
        let array = this.subscribers.get(event)
        if (array === undefined) {
            array = []
            this.subscribers.set(event, array)
        }
        array.push(listener)
        return this
    }

    emit<K extends keyof T>(event: K, ...args: T[K]): this {
        this.subscribers.get(event)?.forEach(listener => listener.call(this, ...args))
        return this
    }
}