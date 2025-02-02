var fs = require('fs')
var path = require('path')
var moment = require('moment')
var convert = require('./convert')
var homedir = require('os').homedir()
var configDir = path.join(homedir, 'timet.json')
var Datastore = require('nedb')
var HashMap = require('hashmap')

/*
{
    reportTags:boolean,
    reportGraphics:boolean,
    startDate: stringDate,
    endDate: stringDate
}
*/
// based on https://github.com/yaronn/blessed-contrib/blob/master/README.md

module.exports = function (params, callback) {
    var config = require(configDir)
    const today = new Date()

    if (!params.startDate) {
        params.startDate = moment(today).add(-30, 'days').toDate();
    } else {
      params.startDate = moment(params.startDate, config.format)
    }
    if (!params.endDate) {
      params.endDate = today;
    } else {
      params.endDate = moment(params.endDate, config.format)
    }
    
    const startDateQuery = Number(moment(params.startDate).format('YYYYMMDD'))
    const endDateQuery = Number(moment(params.endDate).format('YYYYMMDD'))


    var db = new Datastore({ filename: config.db, autoload: true })    

    const query = {
      $and: [
        {date: {$gte: startDateQuery}},
        {date: {$lte: endDateQuery}}
      ]
    };
    
    console.log('###########################################################################')
    console.log('Report between', params.startDate, ' and ', params.endDate)
    console.log('###########################################################################')

    db.find(query).sort({ datetime: 1 }).exec(function(err, recordSet) {
      if (params.reportTags) {
        var total =0
        const result = getHoursByTag(recordSet);
        result.entries().map( item => {
          total += item[1];
          console.log(item[0], checkShowTotal(item[1]));
        })
        console.log('-------> Total: ', checkShowTotal(total))
      } else {
        console.log('===>>>> Not implemented')
      }
      callback()  

      /*
      const result = getTagsByDay(recordSet);
      result.entries().map( item => {
        console.log(item[0]);
        item[1].entries().map( tags => {
          console.log("         ", tags[0], tags[1][0], convert.convertMinsToHrsMins(tags[1][1]));
        });
      })
      */
    })    
}

function getHoursByTag(recordSet) {
  const tagHash = new HashMap();
  
  for (var i = 0; i < recordSet.length; i++) {
    const item = recordSet[i];
    for (var j = 0; j < item.tags.length; j++) {
      const tag = item.tags[j];
      if (!tagHash.has(tag)) {
        tagHash.set(tag, item.time);
      } 
      else {
        tagHash.set(tag, tagHash.get(tag)+item.time);
      }
    }
  }

  return tagHash;
}

function getTagsByDay(recordSet) {
  const tagsByDay = new HashMap();
  
  for (var i = 0; i < recordSet.length; i++) {
    const item = recordSet[i];
    if (!tagsByDay.has(item.date)) {
      tagsByDay.set(item.date, new HashMap());
    } 
    var tagHash = tagsByDay.get(item.date);
    for (var j = 0; j < item.tags.length; j++) {
      const tag = item.tags[j];
      if (!tagHash.has(tag)) {
        tagHash.set(tag, [1, item.time]);
      } 
      else {
        tagHash.set(tag, [tagHash.get(tag)[0]+1,tagHash.get(tag)[1]+item.time]);
      }
    }
  }
  return tagsByDay;
}

function checkShowTotal (t) {
  if (!t) {
    return ''
  } else {
    return ' ' + convert.convertMinsToHrsMins(t) + ' '
  }
}