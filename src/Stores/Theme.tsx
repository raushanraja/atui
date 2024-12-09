import { createContext, createEffect } from 'solid-js';
import { createStore, type SetStoreFunction, type Store } from 'solid-js/store';

export type Theme = {
    theme: string;
    nav: string;
};

export type ThemeInter = {
    theme: Theme;
    setTheme: SetStoreFunction<Theme>;
};

const ThemeDefault: Theme = {
    theme: 'light',
    nav: 'h',
};

const defaultThemeInter: ThemeInter = {
    theme: ThemeDefault,
    setTheme: () => {},
};

const getTheme = (): Theme => {
    const localState = localStorage.getItem('theme');
    if (localState) {
        const parsedTheme = JSON.parse(localState) as Theme;
        if (parsedTheme['theme'] && parsedTheme['nav']) {
            return parsedTheme;
        }
    }
    return ThemeDefault;
};

export function createThemeStore(): [Store<Theme>, SetStoreFunction<Theme>] {
    const defaultTheme = getTheme();
    const [state, setState] = createStore<Theme>(defaultTheme);

    createEffect(() => {
        localStorage.setItem('theme', JSON.stringify(state));
        document.documentElement.setAttribute('data-theme', state.theme);
    });
    return [state, setState];
}

export const ThemeContext = createContext<ThemeInter>(defaultThemeInter);
