/**
 * Created by julian on 11.12.15.
 */

function getCurrentDate(){
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    return day + '.' + month + '.' + year;
}