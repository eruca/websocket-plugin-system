import React, { FC, FunctionComponentElement, ForwardRefExoticComponent } from 'react';
import { Err, Ok, Result } from 'ts-results';

type Validator<T> = (t: T) => Result<void, string>;

interface IHubInputProps<T extends {}> {
    name: string;
    component: FC<T> | ForwardRefExoticComponent<T>;
    defaultProps: Partial<T>;
    useRef: boolean;
    validator?: Validator<Partial<T>>;
}

type IHubMapType<T extends {}> =
    | [FC<T> | ForwardRefExoticComponent<T>, Partial<T>, boolean, Validator<Partial<T>> | undefined]
    | FunctionComponentElement<T>;

class Hub {
    map: Map<string, IHubMapType<any>>;

    constructor() {
        this.map = new Map();
    }

    public register<T extends {}>({
        name,
        component,
        defaultProps,
        useRef,
        validator,
    }: IHubInputProps<T>) {
        // 大小写无关
        const finalType = name.toLowerCase();
        this.map.set(finalType, [component, defaultProps, useRef, validator]);
    }

    public query(name: string): Result<boolean, string> {
        // 大小写无关
        const finalType = name.toLowerCase();
        const value = this.map.get(finalType);
        if (!value) {
            return Err(`${name}未注册`);
        }
        if (Array.isArray(value)) {
            return Ok(value[2] as boolean);
        }

        return Ok(false);
    }

    // 注册没有props的组件，直接缓存实例
    public singular<T extends {}>(name: string, component: FC<T>) {
        // 大小写无关
        const finalType = name.toLowerCase();
        this.map.set(finalType, React.createElement(component, null, null));
    }

    public access<T extends {}>(
        name: string,
        props?: Partial<T>
    ): Result<FunctionComponentElement<T>, string> {
        // 大小写无关
        const finalType = name.toLowerCase();
        const value = this.map.get(finalType) as IHubMapType<T>;
        if (!value) {
            return Err(`${name} 未注册`);
        }
        // 如果不是数组，就是React的组件实例，由singular产生
        if (!Array.isArray(value)) {
            return Ok(value);
        }

        const [component, defaultProps, useRef, validator]: [
            FC<T>,
            Partial<T>,
            boolean,
            Validator<Partial<T>> | undefined,
        ] = value;
        const props2 = Object.assign({}, defaultProps, props);
        if (validator) {
            const res: Result<void, string> = validator(props2);
            if (res.err) {
                return Err(res.val);
            }
        }

        return Ok(React.createElement(component, props2 as T, null));
    }
}

const hub = new Hub();

export default hub;
