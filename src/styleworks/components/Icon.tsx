import { createMemo, type Element } from "solid-js";

interface IconProps {
    size? : string;
    icon : Element;
    class? : string;
}
export default function Icon(props : IconProps) {
    const size = createMemo(() => props.size || '1em');


    return (
        <div class={['frm-icon-block', props.class]} style={{width : size(), height : size()}}>
            {props.icon}
        </div>
    )
}