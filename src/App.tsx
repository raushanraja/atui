import './App.css';
import LeftSidebar from './Components/LeftSidebar';
import Main from './Components/Main';
import { ThemeContext, createThemeStore } from './Stores/Theme';
import { at_response_listener } from './Hooks/Command';
import { createEffect } from 'solid-js';
import { Toaster } from 'solid-toast';
import RightSidebar from './Components/RightSidebar';

function App() {
    createEffect(() => {
        at_response_listener();
    });
    const [theme, setTheme] = createThemeStore();
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <Toaster />
            <div class='h-screen grid grid-cols-12 gap-4 p-4'>
                <LeftSidebar />
                <Main />
                <RightSidebar />
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
