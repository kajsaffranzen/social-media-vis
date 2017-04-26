/*
kmeans algorithm, creates clusters of the data
returns k numbers of objects represeting each cluster
*/
import _ from 'underscore';

let threshold = 0.05;
let qualityCheck = 1000;
var counter = 0;
let minError = 1000;

class Kmeans {
    constructor(){
        console.log('i kmeans-constructor');

    }
    getData(k, data){
        let centroidData = [];
        let randomCentroids = this.getRandomCentroids(k, data);

        for(var i = 0; i < k; i++)
            centroidData.push([]);

        return this.clusterData(centroidData, randomCentroids, data);
    }
    //randomly place k number of cluster points into
    getRandomCentroids(dim, data){
        let a = [];

        for(var i = 0; i < dim; i++)
            a.push(_.sample(data));

        return a;
    }
    clusterData(centroidData, centroids, data){
        do{
            let indexArr = [];
            //calculateCentroidDistances
            for(let value of data){
                var index = this.calculateCentroidDistances(value, centroids);
                indexArr.push(index)
                centroidData[index].push(value)
            }

            //create new centroids
            let newData = [];
            for(let value of centroidData){
                newData.push(this.createNewCentroids(value));
            }

            //check quality
            let prevQuality = qualityCheck;
            qualityCheck = this.checkQuality(centroidData, newData);
            minError = qualityCheck/prevQuality;

            //Repeat steps 2-4 until the difference in core position is small enough (less than a threshold) or until it is not improving.
            counter++;
            console.log('minError: ' + minError);

    } while(minError < threshold)
    console.log('counter: ' + counter);
        return this.creatCircleObjects(centroidData);

    }

    //Assign each point to the cluster with nearest center point.
    calculateCentroidDistances(p, centroids){
        let distance = [];

        for(let value of centroids){
            distance.push(Math.sqrt(
                Math.pow(p.lat - value.lat, 2) +
                Math.pow(p.lng - value.lng, 2)
            ));
        }
        var min = _.min(distance);
        var index = distance.indexOf(min);
        return index;
    }

    //recalculate the cluster cores and move them to the center of each cluster.
    createNewCentroids(centroidData){
        let lat = 0,
            lng = 0;

        for(let value of centroidData){
            lat += value.lat;
            lng += value.lng;
        }
        lat = lat/centroidData.length;
        lng = lng/centroidData.length;

        let newObject = {
            lat: lat,
            lng: lng
        }
        return newObject;
    }

    //Check the quality of each cluste
    checkQuality(centroidData, newCentroids){
        let sum = 0;
        for(var i = 0; i < newCentroids.length; i++){
            for(let val of centroidData){
                for(let value of val){
                    sum += Math.pow((value.lat-newCentroids[i].lat),2);
                    sum += Math.pow((value.lng-newCentroids[i].lng),2);
                }
            }
        }
        return Math.sqrt(sum);

    }

    //Modify array before drawing in map
    //Need data that shows how many data points the centroid has
    creatCircleObjects(centroidData){
        let coords = [];
        for(let value of centroidData){
            var h = this.createNewCentroids(value);
            var newObject = {
                lat: h.lat,
                lng: h.lng,
                rad: value.length
            };
            coords.push(newObject)
        }
        return coords;
    }
}
export default Kmeans;
