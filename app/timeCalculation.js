//få in data från Mapbox.js
import Moment from 'moment'
import { extendMoment } from 'moment-range';
import tz from 'moment-timezone'
const moment = extendMoment(Moment);


//tilldela varje data point en ny variabel som är indexet för vilken färg cirkel ska ha

class timeCalculation{
    constructor(){
        this.nrOfIntervals = 3;
        this.intervals = [];
        //this.createInterval();
    }
    createInterval(start, end){
        //skapa de olika tids-intervallen, alltså hur många olika färger det ska finnas
        let end_date = new Date(end);
        end_date = end_date.getTime();

        let start_date = new Date(start);
        start_date = start_date.getTime();

        let diff = end_date - start_date;
        let del = diff/this.nrOfIntervals+1;

        for(var i = 0; i < (this.nrOfIntervals+1); i++){
            var time = moment(new Date(start_date+(del*i))).format('YYYY-MM-DD hh:mm')
            this.intervals.push(time)
        }

        console.log(this.intervals);

        /*if(m.minute() < 30) the_moment = m.startOf('hour');
        else the_moment = m.add(1, 'hour').startOf('hour');*/
    }
    assignInterval(data){
        //loop throug the data set and assign an index to each point that
        //represent which interval it belongs to
        for(let value of data) {
            if(value.created_at > this.intervals[0] &&value.created_at < this.intervals[1])
                value.index = 0;
            else if(value.created_at > this.intervals[1] &&value.created_at < this.intervals[2])
                value.index = 1;
            else if(value.created_at > this.intervals[2] &&value.created_at < this.intervals[3])
                value.index = 2;
            else value.index = 4;
        }

        return data;
    }
    assignIntervalToObject(value){
            if(value.created_at > this.intervals[0] &&value.created_at < this.intervals[1])
                value.index = 0;
            else if(value.created_at > this.intervals[1] &&value.created_at < this.intervals[2])
                value.index = 1;
            else if(value.created_at > this.intervals[2] &&value.created_at < this.intervals[3])
                value.index = 2;
            else value.index = 4;

        return value;
    }
} export default timeCalculation;
