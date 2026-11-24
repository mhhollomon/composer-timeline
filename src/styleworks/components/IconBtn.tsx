import { merge, type Element } from "solid-js";
import Icon from "./Icon";


interface IconBtnProps {
    class? : string;
    icon : Element;
    text : string;
    variant? : string;
    disabled? : boolean;
    onClick? : () => void;
}

export default function IconBtn(_props : IconBtnProps) {
    const props = merge({variant : 'brand'}, _props)

    return (
        <button class={["btn btn-icon-text", `vrnt-${props.variant}`]} 
                onClick={props.onClick} disabled={props.disabled}>
            <Icon icon={props.icon} />
            {props.text}
        </button>
    );



}