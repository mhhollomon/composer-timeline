import { createMemo, type Element } from "solid-js";
import Icon from "./Icon";


interface IconBtnProps {
    class? : string;
    icon : Element;
    text : string;
    variant? : string;
    disabled? : boolean;
    onClick? : () => void;
}

export default function IconBtn(props : IconBtnProps) {
    const variant_class = createMemo(() => {
        const v = props.variant || 'brand';
        return `vrnt-${v}`;
    });

    return <button class={["btn btn-icon-text", variant_class()]} 
            onClick={props.onClick} disabled={props.disabled}>
        <Icon icon={props.icon} />
        {props.text}
    </button>



}