
import { min as date_min, max as date_max, differenceInDays } from 'date-fns';
import { LargeNumberLike } from 'node:crypto';
import { memoLastCall, round } from 'radashi';

const refDate = new Date(2000, 0, 1);

function _parseDate(input : string) : Date | undefined {
    return undefined;
}
export class Composer {

}

export class Era {
    name  : string;
    start : Date;
    end   : Date;
    url?  : string;
    lane  : number = 0;

    constructor(name : string, start : number, end : number, url? : string) {
        this.name  = name;
        this.start = new Date(start, 5, 2);
        this.end   = new Date(end, 5, 1);
        this.url   = url || undefined;
    }

    startString() : string {
        return this.start.getFullYear().toString();
    }

    endString() : string {
        return this.end.getFullYear().toString();
    }

}

export class CEvent {

}

export class TimeLineData {
    eras : Era[];
    era_lanes : number = 0;
    min_date : Date;
    max_date : Date;

    constructor(eras : Era[], era_lanes : number, min_date: Date, max_date : Date) {
        this.eras = eras;
        this.era_lanes = era_lanes;
        this.min_date = min_date;
        this.max_date = max_date;
    }

    iota(width : number) : number {
        return width / differenceInDays(this.max_date, this.min_date);
    }

    position(width : number, date : Date) : number {
        return round(this.iota(width) * differenceInDays(date, this.min_date));
    }

}

export function parse_data(data : Record<string, any>) : TimeLineData {

    let min_date = new Date(2200, 0, 1);
    let max_date = new Date(1, 0, 1);

    const lanes : Date[] = [];

    // ----- Parse eras ---------
    const eras : Era[] = data.eras.map((e : any) => {
        const era = parse_era(e);

        min_date = date_min([min_date, era.start]);
        max_date = date_max([max_date, era.end]);
        
        // Place the era in a lane.

        let lane_num = -1;
        for(let i = 0; i < lanes.length; ++i) {
            if (lanes[i] < era.start) {
                lane_num = i;
                break;
            }
        }
        if (lane_num === -1) {
            lanes.push(era.end);
            era.lane = lanes.length - 1;
        } else {
            lanes[lane_num] = era.end;
            era.lane = lane_num;
        }


        return era;
    });

    const era_lanes = lanes.length;

    console.log("min_date =", min_date, "max_date =", max_date);

    return new TimeLineData(eras, era_lanes, min_date, max_date);

}

function parse_era(input : Record<string, any>) : Era {
    return new Era(input.name, input.start, input.end, input?.url);
}

function parse_event(input : Record<string, any>) : CEvent {
    return new CEvent();
}

function parse_composer(input : Record<string, any>) : Composer {
    return new Composer();
}