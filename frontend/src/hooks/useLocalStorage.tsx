import { useEffect, useState } from "react";

function getSavedValue<T>(key: string, initialValue: T): T {
    const val = localStorage.getItem(key);

    if (val)
        return JSON.parse(val);

    if (initialValue instanceof Function)
        return initialValue();

    localStorage.setItem(key, JSON.stringify(initialValue));

    return initialValue;
}

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(getSavedValue(key, initialValue));
    }, [value]);

    return [value, setValue];
}