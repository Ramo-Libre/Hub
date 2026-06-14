import { browser } from '$app/environment';
import { PreferencesManager, type PreferencesSerial } from './preferences.svelte';

export const RAMOLIBREHUB_KEY_PREFIX = 'RAMOLIBREHUB_';
const PREFERENCES_KEY = `${RAMOLIBREHUB_KEY_PREFIX}PREFERENCES_V1`;

export type FullSnapshot = {
	[PREFERENCES_KEY]: PreferencesSerial;
};

class RootStore {
	private _preferences = new PreferencesManager();

	get preferences() {
		return this._preferences;
	}

	get empty() {
		return this._preferences.empty();
	}

	constructor() {
		if (browser) this.load();
		$effect.root(() => {
			$effect(() => {
				db.save();
			});
		});
	}

	createSnapshot() {
		const snapshot = {
			[PREFERENCES_KEY]: this._preferences.toSerial()
		};

		return snapshot;
	}

	fromSnapshot(snapshot: FullSnapshot) {
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith(RAMOLIBREHUB_KEY_PREFIX)) {
				localStorage.removeItem(key);
			}
		});

		Object.entries(snapshot).forEach(([key, val]) => {
			localStorage.setItem(key, JSON.stringify(val));
		});

		this.load();
	}

	private load() {
		console.log('RootStore:load');
		if (!browser) return;
		const preferencesData = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
		if (preferencesData) this._preferences.fromSerial(preferencesData);
	}

	private save() {
		console.log('RootStore:save');
		if (!browser) return;
		const preferencesData = JSON.stringify(this._preferences.toSerial());
		localStorage.setItem(PREFERENCES_KEY, preferencesData);
	}

	clear() {
		console.log('RootStore:clear');
		this._preferences.clear();
	}
}

export const db = new RootStore();
