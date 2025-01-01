import './App.css';
import Left from './Components/Left';
import Main from './Components/Main';
import Right from './Components/Right';
import { ThemeContext, createThemeStore } from './Stores/Theme';
import { at_response_listener } from './Hooks/Command';
import { createEffect } from 'solid-js';
import { Toaster } from 'solid-toast';

function App() {
    createEffect(() => {
        at_response_listener();
    });
    const [theme, setTheme] = createThemeStore();
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <Toaster />
            <div class='h-screen grid grid-cols-12 gap-4 p-4'>
                <Left />
                <Main />
                <Right />
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
