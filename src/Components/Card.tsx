import { JSXElement } from 'solid-js';

type KardProps = { title: string } & {
    children: JSXElement;
    classes?: string;
};

function Kard(props: KardProps) {
    return (
        <div class={`p-2 bg-base-300 ${props.classes ?? 'h-full'}`}>
            <div class='prose font-semibold mb-4'>{props.title}</div>
            <div class='h-[calc(100%-3rem)]'>{props.children}</div>
        </div>
    );
}

export default Kard;
