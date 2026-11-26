import * as _ from "radashi";
import { createUniqueId } from "solid-js";
import { TimeLineData, Era } from "~/components/tl_types";





function EraItem(props: { data: TimeLineData, era: Era, index: number, width: number }) {

    const popoverId = createUniqueId();
    let tooltip!: HTMLDivElement;

    function compute_width(e: Era): string {
        const start = props.data.position(props.width, e.start);
        const end = props.data.position(props.width, e.end);

        return _.round(end - start).toString() + 'px';
    }

    function compute_left(e: Era): string {
        const start = props.data.position(props.width, e.start);
        return _.round(start).toString() + 'px';
    }

    function compute_top(e: Era): string {
        return `calc(${e.lane} * 2rem)`;
    }


    return <>
        <button class="timeline-era" style={{
            width: compute_width(props.era),
            height: '2rem',
            top: compute_top(props.era),
            left: compute_left(props.era),
            "background-color": `var(--tl-bg-${(props.index % 3) + 1})`,
            'anchor-name': `--era-anchor-${popoverId}`,
        }}
            onMouseEnter={() => tooltip.showPopover()}
            onMouseLeave={() => tooltip.hidePopover()}
            popovertarget={`${popoverId}_dialog`}
        >
            {props.era.name}
            <div id={popoverId} popover="hint" class="era-tooltip-popover" ref={tooltip}
                style={{ 'position-anchor': `--era-anchor-${popoverId}`, }}
            >
                <div class="era-tooltip-data">
                    <div class='fw-bold'>{props.era.name}</div>
                    <div>{props.era.startString()} - {props.era.endString()}</div>
                </div>

            </div>

        </button>
        {/* Outside the button so it doesn't trigger the hint */}
        <div id={`${popoverId}_dialog`} popover="auto" class='era-dialog-popover'>
            <div class="era-dialog-data">
                <div class='fw-bold'>{props.era.name}</div>
                <div>{props.era.startString()} - {props.era.endString()}</div>
                {props.era.url && <a href={props.era.url} target="_blank">{props.era.url}</a>}
            </div>
        </div>
    </>

}

export default function Timeline(props: { data: TimeLineData, width: number }) {

    function compute_tick_left(year : number) : string {
        const d = new Date(year, 0, 1);
        const start = props.data.position(props.width, d);
        //return 'calc(anchor(left) + ' + _.round(start).toString() + 'px)';
        return _.round(start).toString() + 'px';
    }

    // Smallest decade number strictly larger than d
    function lowest_decade(d : Date) : number {
        return Math.floor((d.getFullYear() + 10) / 10) * 10;
    }

    // Largest century year strictly smaller than d
    function highest_decade(d: Date) : number {
        const h = Math.floor((d.getFullYear()-1) / 10) * 10;
        console.log("highest = ", h);
        return h;
    }


    return (
        <div class="timeline">
            <div class="timeline-ruler" >
                 {_.range(lowest_decade(props.data.min_date),
                         highest_decade(props.data.max_date),
                         i => i,
                         10).toArray().map((year) => {
                               
                             return (year % 100 === 0) ? <> <div class="long-ruler-tick" style={{
                                 left : compute_tick_left(year),
                             }} />
                             <div class="ruler-tick-number" style={{
                                 left : compute_tick_left(year),
                             }}>{year}</div>
                             </> : <div class="short-ruler-tick" style={{
                                 left : compute_tick_left(year),
                             }} />

                             
                         })

                 }
            </div>
            <div class="timeline-era-container">
                {props.data.eras.map(
                    (e, index) => <EraItem data={props.data} era={e} width={props.width} index={index} />
                )}
            </div>
        </div>
    );
 
}