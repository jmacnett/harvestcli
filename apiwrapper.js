'use strict';

const https = require('https');
const querystring = require('querystring');
const cfg = require('./config');

// we only use the v2 api thus far
const host = 'api.harvestapp.com';

async function doRequest(endpoint, method, data, success) {
    var dataString = JSON.stringify(data);
    if(!endpoint.toLowerCase().includes('/api/v2')) {
        endpoint = "/api/v2/" + endpoint;
    }

    var headers = {
        'Harvest-Account-ID': cfg.current().account,
        'Authorization': 'Bearer ' + cfg.current().token,
        'User-Agent': 'Harvest cli wrapper'
    };

    if(method == 'GET') { 
        endpoint += '?' + querystring.stringify(data);
    }
    else 
    {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = dataString.length;
    }

    var options = {
        host: host,
        path: endpoint,
        method: method,
        headers: headers
      };
    
      var req = https.request(options, function(res) {
        res.setEncoding('utf-8');
    
        var responseString = '';
    
        res.on('data', function(data) {
          responseString += data;
        });
    
        res.on('end', function() {
          //console.log(responseString);
          var responseObject = JSON.parse(responseString);
          success(responseObject);
        });
      });
    
      req.write(dataString);
      req.end();
}

module.exports.getTimer = async (args) => {
    await doRequest('time_entries','GET',{
        is_running: true
    },(res)=>{

        return res['total_entries'];
        let tcnt = res['total_entries'];
        if(tcnt > 0) {
            console.log('No active timers.');
            return;
            //
        }
        console.log(`${tcnt} active timer${ tcnt == 1 ? '' : 's'}.`);

    });
}

module.exports.startTimer = async (args) => {
    doRequest('time_entries','GET',{
        is_running: true
    },(res)=>{
        let tcnt = res['total_entries'];
        if(tcnt > 0) {
            console.log('No active timers.');
            return;
            //
        }
        console.log(`${tcnt} active timer${ tcnt == 1 ? '' : 's'}.`);

    })
}