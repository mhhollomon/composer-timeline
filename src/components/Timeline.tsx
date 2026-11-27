import * as _ from "radashi";
import { CalculationInterpolation } from "sass";
import { createUniqueId } from "solid-js";
import { TimeLineData, Item } from "~/components/tl_types";





function TimelineItem(props: { data: TimeLineData, item: Item, class? : string | string[] , width: number, offset: number }) {

    const popoverId = createUniqueId();
    let tooltip!: HTMLDivElement;

    function compute_width(e: Item): string {
        const start = props.data.position(props.width, e.start);
        const end = props.data.position(props.width, e.end);

        return _.round(end - start).toString() + 'px';
    }

    function compute_left(e: Item): string {
        const start = props.data.position(props.width, e.start);
        return _.round(start).toString() + 'px';
    }

    function compute_top(e: Item): string {
        return `calc(${e.lane + props.offset} * 2rem)`;
    }


    return <>
        <button class={["timeline-era", props.class]}
            style={{
                width: compute_width(props.item),
                height: '2rem',
                top: compute_top(props.item),
                left: compute_left(props.item),
                'anchor-name': `--era-anchor-${popoverId}`,
            }}
            onMouseEnter={() => tooltip.showPopover()}
            onMouseLeave={() => tooltip.hidePopover()}
            popovertarget={`${popoverId}_dialog`}
        >
            {props.item.displayName()}

            {/* ------ Tooltip ------ */}
            <div id={popoverId} popover="hint" class="era-tooltip-popover" ref={tooltip}
                style={{ 'position-anchor': `--era-anchor-${popoverId}`, }}
            >
                <div class="era-tooltip-data">
                    <div class='fw-bold'>{props.item.name}</div>
                    <div>{props.item.startString} - {props.item.endString}</div>
                </div>

            </div>

        </button>

        {/* ------ Information Dialog ------ */}
        {/* Outside the button so it doesn't trigger the hint */}
        <div id={`${popoverId}_dialog`} popover="auto" class='era-dialog-popover'>
            <div class="era-dialog-data">
                <div class='fw-bold'>{props.item.name}</div>
                <div>{props.item.startString} - {props.item.endString}</div>
                {props.item.url && <a href={props.item.url} target="_blank">{props.item.url}</a>}
            </div>
        </div>
    </>

}


export default function Timeline(props: { data: TimeLineData, width: number }) {

    function compute_tick_left(year: number): string {
        const d = new Date(year, 0, 1);
        const start = props.data.position(props.width, d);
        //return 'calc(anchor(left) + ' + _.round(start).toString() + 'px)';
        return _.round(start).toString() + 'px';
    }

    // Smallest decade number strictly larger than d
    function lowest_decade(d: Date): number {
        return Math.floor((d.getFullYear() + 10) / 10) * 10;
    }

    // Largest century year strictly smaller than d
    function highest_decade(d: Date): number {
        const h = Math.floor((d.getFullYear() - 1) / 10) * 10;
        console.log("highest = ", h);
        return h;
    }

    function LongTick(props: { year: number }) {
        return <>
            <div class="long-ruler-tick" style={{
                left: compute_tick_left(props.year),
            }} />
            <div class="ruler-tick-number" style={{
                left: compute_tick_left(props.year),
            }}>{props.year}</div>
        </>
    }

    function ShortTick(props: { year: number }) {
        return <div class="short-ruler-tick" style={{
            left: compute_tick_left(props.year),
        }} />
    }

    return (
        <div class="timeline">
            <div class="timeline-ruler" >
                {_.range(lowest_decade(props.data.min_date),
                    highest_decade(props.data.max_date),
                    i => i,
                    10).toArray().map((year) => {

                        return (year % 100 === 0) ? <LongTick year={year} /> : <ShortTick year={year} />;

                    })

                }
            </div>
            <div class="timeline-era-container" style={{height : `calc(2em * (${props.data.era_lanes + props.data.event_lanes}))`}}>
                {props.data.eras.map(
                    (e, index) => <TimelineItem data={props.data} item={e} width={props.width} class={`tl-era-bg-${index % 3 + 1}`} offset={0} />
                )}
                {props.data.events.map(
                    (e, index) => <TimelineItem data={props.data} item={e} width={props.width} class='tl-event-bg' offset={props.data.era_lanes} />
                )}
            </div>
            <div class="timeline-composer-container">
                {props.data.composers.map(
                    (e, index) => <TimelineItem data={props.data} item={e} width={props.width} offset={0} />
                )}
            </div>
        </div>
    );

}