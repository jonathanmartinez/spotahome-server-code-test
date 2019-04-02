const express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

app.all('/api/homecards', (req, res, next) => {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        const markersURL = 'https://frontend-interview.spotahome.com/api/public/listings/search/markers/madrid';
        const roomsURL = 'https://frontend-interview.spotahome.com/api/public/listings/search/homecards_ids';

        request(markersURL, (error, response, body) => {
          const ROOMS_TO_SHOW = 30;
          const rooms = JSON.parse(body).data;
          const roomIds = rooms.slice(0, ROOMS_TO_SHOW).map(obj => `ids[]=${obj.id}`);
          const queryParams = roomIds.join('&');
          request(`${roomsURL}?${queryParams}`).pipe(res);
        });
    }
});

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
    console.log('CORS Proxy server listening on ' + app.get('port'));
});
