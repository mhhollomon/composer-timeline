
const MONTH : any = {
    'jan' : 1,
    'feb' : 2,
    'mar' : 3,
    'apr' : 4,
    'may' : 5,
    'jun' : 6,
    'jul' : 7,
    'aug' : 8,
    'sep' : 9,
    'oct' : 10,
    'nov' : 11,
    'dec' : 12,
}

export class Composer {
    name : string;
    short : string;
    birth : Date;
    death : Date;

    constructor(a : any) {
        if ('name' in a) {
            this.name = a['name']
        } else {
            throw Error("no name given for composer")
        }

        if ('short' in a) {
            this.short = a['short'];
        } else {
            const al = this.name.split(" ");
            this.short = al[al.length-1]
        }

        if ( 'born' in a ) {
            this.birth = this.read_date(a['born'])
        } else {
            throw Error("No birthdate given for " + this.name)
        }

        if ( 'died' in a ) {
            this.death = this.read_date(a['died'])
        } else {
            throw Error("No death date given for " + this.name)
        }

    }

    private read_date(date_string : string) : Date {

        const parts = date_string.toString().trim().split('-')
        var day = 16
        var month = 5 /* jan = 0 */
        var year = 2020

       if (parts.length == 1) {
            year = (parseInt(parts[0]))
        } else if (parts.length == 2) {
            month = MONTH[parts[0].toLowerCase()] -1
            year = parseInt(parts[1])
        } else {
            day = parseInt(parts[0])
            month = MONTH[parts[1].toLowerCase()] - 1
            year = parseInt(parts[2])
        }

        return new Date(year, month, day)
    }

    public birth_year() : number {
        return this.birth.getFullYear();
    }
    public death_year() : number {
        return this.death.getFullYear();
    }

}

export function read_composers(d : any) : Array<Composer> {

    var retval = new Array<Composer>();

    d.forEach((c :any ) => {
        retval.push(new Composer(c))
    })


    return retval;

}