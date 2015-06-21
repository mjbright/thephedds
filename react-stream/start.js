var DeepstreamServer = require( 'deepstream.io' ),
    server = new DeepstreamServer();

// Optionally you can specify some settings, a full list of which
// can be found here http://deepstream.io/docs/deepstream.html
server.set( 'host', 'thephedds.com' );
server.set( 'port', 6020 );

// start the server
server.start();
