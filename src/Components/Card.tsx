import { JSXElement } from 'solid-js';

type KardProps = { title: string } & {
    children: JSXElement;
};

function Kard(props: KardProps) {
    return (
        <div class='h-full p-2 bg-base-300'>
            <div class='prose font-semibold mb-4'>{props.title}</div>
            <div class='h-[calc(100%-3rem)]'>{props.children}</div>
        </div>
    );
}

export default Kard;
