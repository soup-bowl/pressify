import { useState } from "react"

const getLocalStorageItem = <T>(key: string): T | null => {
	const item = localStorage.getItem(key)
	return item ? JSON.parse(item) : null
}

const setLocalStorageItem = <T>(key: string, value: T): void => {
	localStorage.setItem(key, JSON.stringify(value))
}

const useSettings = <T>(key: string, defaultValue: T): [T, (value: T) => void, () => void] => {
	const [setting, setSetting] = useState<T>(() => {
		const storedValue = getLocalStorageItem<T>(key)
		return storedValue !== null ? storedValue : defaultValue
	})

	const saveSetting = (value: T): void => {
		setLocalStorageItem(key, value)
		setSetting(value)
	}

	const clearSetting = (): void => {
		localStorage.removeItem(key)
		setSetting(defaultValue)
	}

	return [setting, saveSetting, clearSetting]
}

export default useSettings
