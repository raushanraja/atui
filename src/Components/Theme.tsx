import { Component, useContext } from 'solid-js';
import { ThemeContext } from '../Stores/Theme';
const color_themes = ['dim'];

const HorizontalButton: Component = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={() => {
                setTheme({ ...theme, nav: 'h' });
            }}>
            Horizontal
        </button>
    );
};

const VerticalButton: Component = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={() => {
                setTheme({ ...theme, nav: 'v' });
            }}>
            Vertical
        </button>
    );
};

const ThemeSelector: Component = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <>
            <select
                class='w-full h-10 select-sm rounded select select-bordered select-primary my-2'
                onChange={(e: Event) => {
                    const target = e.target as HTMLSelectElement;
                    setTheme({ ...theme, theme: target.value });
                }}>
                <option disabled value={theme.theme} selected>
                    {theme.theme}
                </option>
                {color_themes.map((theme) => {
                    return <option value={theme}>{theme}</option>;
                })}
            </select>
        </>
    );
};

export { ThemeSelector, HorizontalButton, VerticalButton };
