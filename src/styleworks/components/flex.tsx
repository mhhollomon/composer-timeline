import { round } from "radashi";
import { createMemo, type Element } from "solid-js";

type dirType = "col"|"row"|"column";

interface FlexProps {
    children : Element;
    gap? : number;
    class? : string | string[];
    dir? : dirType;
};

export default function Flex(props : FlexProps) {
    const gap = createMemo(() => {
        if (props.gap)
            return 'gap-' + Math.min(Math.max(round(props.gap), 0), 6);
        
        return undefined;
    });

    const dir_class = createMemo(() => {
        if (props.dir)
            return 'flex-dir-' + props.dir.substring(0,3);

        return undefined;
    });


    return (<div class={['d-flex', props.class, dir_class(), gap()]}>{props.children}</div>)

}