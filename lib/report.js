var fs = require('fs')
var path = require('path')
var moment = require('moment')
var convert = require('./convert')
var homedir = require('os').homedir()
var configDir = path.join(homedir, 'timet.json')
var Datastore = require('nedb')

/*
{
    reportTags:boolean,
    reportGraphics:boolean,
    startDate: stringDate,
    endDate: stringDate
}
*/
module.exports = function (params, callback) {
    const today = new Date()
    if (!params.startDate) {
        
    }

}

function checkShowTotal (t) {
  if (!t) {
    return ''
  } else {
    return ' ' + convert.convertMinsToHrsMins(t) + ' '
  }
}
