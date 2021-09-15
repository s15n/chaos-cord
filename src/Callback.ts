export interface CallbackHandler<T> {
    callback: Callback<T>
}

export type Callback<T> = (data: T) => void;

export const noCallback = () => {}