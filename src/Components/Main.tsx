import { Switch, Match, createSignal } from 'solid-js';

import { GeneralCommand } from './Command/General';
import { StatusCommand } from './Command/Status';

const tabs = [
    'General',
    'Status',
    '(U)SIM Related',
    'Network',
    'Call',
    'Phonebook',
    'SMS',
    'PDP',
    'Supplementary',
    'Hardware',
];

function Main() {
    const [activeTab, setActiveTab] = createSignal(tabs[0]);
    return (
        <div class='col-span-7 bg-base-100 bg-opacity-45 p-4 overflow-clip'>
            <div class='base-100 rounded-md w-full h-full'>
                <div role='tablist' class='tabs tabs-boxed'>
                    {tabs.map((tab) => {
                        return (
                            <a
                                role='tab'
                                class='tab'
                                classList={{
                                    'tab-active': activeTab() == tab,
                                }}
                                onClick={() => setActiveTab(tab)}>
                                {tab}
                            </a>
                        );
                    })}
                </div>
                <Switch>
                    <Match when={activeTab() == tabs[0]}>
                        <GeneralCommand />
                    </Match>
                    <Match when={activeTab() == tabs[1]}>
                        <StatusCommand />
                    </Match>
                    <Match when={activeTab() == tabs[2]}>
                        <div> {tabs[2]} </div>
                    </Match>
                    <Match when={activeTab() == tabs[3]}>
                        <div> {tabs[3]} </div>
                    </Match>
                    <Match when={activeTab() == tabs[4]}>
                        <div> {tabs[4]} </div>
                    </Match>
                    <Match when={activeTab() == tabs[5]}>
                        <div> {tabs[5]} </div>
                    </Match>
                    <Match when={activeTab() == tabs[6]}>
                        <div> {tabs[6]} </div>
                    </Match>
                    <Match when={activeTab() == tabs[7]}>
                        <div> {tabs[7]} </div>
                    </Match>
                    <Match when={activeTab() == tabs[8]}>
                        <div> {tabs[8]} </div>
                    </Match>
                    <Match when={activeTab() == tabs[9]}>
                        <div> {tabs[9]} </div>
                    </Match>
                </Switch>
            </div>
        </div>
    );
}
export default Main;
