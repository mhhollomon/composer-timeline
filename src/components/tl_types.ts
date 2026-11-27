
import { min as date_min, max as date_max, differenceInDays } from 'date-fns';
import * as _ from 'radashi';


function starts_on_year(y : number) : Date {
    return new Date(y, 0, 1);
}

function ends_at_year(y : number) {
    return new Date(y-1, 11, 31);
}

/*
 * Dates from the yml file are assumed to be in one of three forms:
 * A number - This will represent a year.
 * A string -
 *    MMM-YYYY - A month followed by a year (e.g. Mar-1305)
 *    DD-MMM-YYYY - day, month, year (e.g. 13-Aug-1410)
 */
const MONTHS : Map<string, number> = new Map([
    ['jan' , 0],    ['feb' , 1],    ['mar' , 2],    ['apr' , 3],
    ['may' , 4],    ['jun' , 5],    ['jul' , 6],    ['aug' , 7],
    ['sep' , 8],    ['oct' , 9],    ['nov' , 10],   ['dec' , 11]
]);

function parse_yml_date(input : string | number, end : boolean = false) : Date {
    if (_.isNumber(input)) {
        return end ? ends_at_year(input) : starts_on_year(input);
    }

    const pieces = input.split('-');
    if (pieces.length === 2) {
        const day = 15;
        const month = MONTHS.get(pieces[0].toLowerCase());
        if (_.isUndefined(month))
            throw(`Invalid month name '${pieces[0]}' in date '${input}' read from yml file`);
        const year = _.toInt(pieces[1]);
        return new Date(year, month, day)
        
    } else if (pieces.length === 3){
        const day = _.toInt(pieces[0]);
        const month = MONTHS.get(pieces[1].toLowerCase());
        if (_.isUndefined(month))
            throw(`Invalid month name '${pieces[1]}' in date '${input}' read from yml file`);
        const year = _.toInt(pieces[2]);
        return new Date(year, month, day)
    } else {
        throw Error(`Invalid date '${input}' read for yml file.`);
    }


}

export class Item {
    name  : string;
    start : Date;
    startString : string;
    end   : Date;
    endString : string;
    url?  : string;
    short? : string;
    lane  : number = 0;

    constructor(name : string, start : string | number, end : string | number, url? : string, short? : string) {
        this.name  = name;
        this.startString = start.toString();
        this.start = parse_yml_date(start);
        this.endString = end.toString();
        this.end   = parse_yml_date(end, true);
        this.url   = url || undefined;
        this.short = short || undefined;
    }

    displayName() : string {
        return this.short || this.name;
    }
}

export class Era extends Item {
    constructor(name : string, start : number, end : number, url? : string) {
        super(name, start, end, url);
    }
}

export class CEvent extends Item {
    constructor(name : string, start : string | number, end : string | number, url? : string) {
        super(name, start, end, url);
    }
}

export class Composer extends Item {
     constructor(name : string, start : string | number, end : string | number, url? : string, short? : string) {
        if (_.isUndefined(short)) {
            const pieces = name.split(' ');
            short = pieces.pop();
        }
        super(name, start, end, url, short);
    }   

}


export class TimeLineData {
    eras : Era[];
    events : CEvent[];
    composers : Composer[];
    era_lanes : number = 0;
    event_lanes : number = 0;
    min_date : Date;
    max_date : Date;

    constructor(eras : Era[], events: CEvent[], composers : Composer[], 
            era_lanes : number, event_lanes : number,
            min_date: Date, max_date : Date) {
        this.eras = eras;
        this.events = events;
        this.composers = composers;
        this.era_lanes = era_lanes;
        this.event_lanes = event_lanes;
        this.min_date = min_date;
        this.max_date = max_date;
    }

    iota(width : number) : number {
        return width / differenceInDays(this.max_date, this.min_date);
    }

    position(width : number, date : Date) : number {
        return _.round(this.iota(width) * differenceInDays(date, this.min_date));
    }

}

export function parse_data(data : Record<string, any>) : TimeLineData {

    let min_date = new Date(3200, 0, 1);
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

    console.log("After eras: min_date =", min_date, "max_date =", max_date);

    lanes.length = 0;

     // ----- Parse events ---------
    const events : CEvent[] = data.events.map((e : any) => {
        const event = parse_event(e);

        min_date = date_min([min_date, event.start]);
        max_date = date_max([max_date, event.end]);
        
        // Place the event in a lane.

        let lane_num = -1;
        for(let i = 0; i < lanes.length; ++i) {
            if (lanes[i] < event.start) {
                lane_num = i;
                break;
            }
        }
        if (lane_num === -1) {
            lanes.push(event.end);
            event.lane = lanes.length - 1;
        } else {
            lanes[lane_num] = event.end;
            event.lane = lane_num;
        }

        return event;
    });

    console.log("After events: min_date =", min_date, "max_date =", max_date);
    const event_lanes = lanes.length;

    lanes.length = 0;

   
     // ----- Parse composers ---------
    const composers : Composer[] = data.composers.map((e : any) => {
        const composer = parse_composer(e);

        min_date = date_min([min_date, composer.start]);
        max_date = date_max([max_date, composer.end]);
        
        // Place the composer in a lane.

        let lane_num = -1;
        for(let i = 0; i < lanes.length; ++i) {
            if (lanes[i] < composer.start) {
                lane_num = i;
                break;
            }
        }
        if (lane_num === -1) {
            lanes.push(composer.end);
            composer.lane = lanes.length - 1;
        } else {
            lanes[lane_num] = composer.end;
            composer.lane = lane_num;
        }

        return composer;
    });

    console.log("After composers: min_date =", min_date, "max_date =", max_date);

    return new TimeLineData(eras, events, composers, era_lanes, event_lanes, min_date, max_date);

}

function parse_era(input : Record<string, any>) : Era {
    return new Era(input.name, input.start, input.end, input?.url);
}

function parse_event(input : Record<string, any>) : CEvent {
    return new CEvent(input.name, input.start, input.end, input?.url);
}

function parse_composer(input : Record<string, any>) : Composer {
    return new Composer(input.name, input.born, input.died, input?.url, input?.short);
}