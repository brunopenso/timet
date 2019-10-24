var fs = require('fs')
var path = require('path')
var moment = require('moment')
var convert = require('./convert')
var homedir = require('os').homedir()
var configDir = path.join(homedir, 'timet.json')
var Datastore = require('nedb')
var moment = require('moment');
/*
{
    reportTags:boolean,
    reportGraphics:boolean,
    startDate: stringDate,
    endDate: stringDate
}
*/
function report(params, callback) {
    const today = new Date()
    if (!params.startDate) {
        params.startDate = moment.add(-30, 'days');
    }
    if (!params.endDate) {
      params.endDate = today;
    }

    console.log(params.startDate, params.endDate);
    callback();
}

function checkShowTotal (t) {
  if (!t) {
    return ''
  } else {
    return ' ' + convert.convertMinsToHrsMins(t) + ' '
  }
}

module.exports = { report }