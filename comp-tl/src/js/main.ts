// Import our custom CSS
import '../scss/styles.scss';
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import {read_composers, Composer} from './Composer'

const composers = require('../assets/data/composers.yml')['default'];

function component() {

    const composer_objects = read_composers(composers);

    const timeline = document.getElementById("timeline");

    const lanes = new Array<number>()

    const lane_elements = new Array<Array<Composer>>()

    composer_objects
        .sort((a,b) => a.birth_year() - b.birth_year())
        .forEach( element  => {

        const birth_year = element.birth_year()
        const death_year = element.death_year()

        var lane = 0
        while (1) {
            if (lane >= lanes.length)
                break;
            if (lanes[lane] <= birth_year)
                break;
            lane += 1
        }
        if (lane >= lanes.length) {
            lanes.push(death_year)
            lane_elements.push(new Array<Composer>())
        } else {
            lanes[lane] = death_year
        }

        lane_elements[lane].push(element)
    });

    var lane = 1

    lane_elements.forEach(comp_array => {

        comp_array.forEach(ele => {
            const para = document.createElement('p')
            para.innerHTML = '(' + lane + ')' + ele.short + '  | ' + ele.birth_year() 
                + ' | ' + ele.death_year();
            timeline?.appendChild(para);
    
        });

        lane += 1;

    });


        

}

component();