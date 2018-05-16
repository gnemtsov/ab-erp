'use strict';

const jwt = require('jsonwebtoken');

//process.env.PROD and other env.vars are set in production only
if(process.env.PROD === undefined){
    process.env = require('config/main.json');
    process.env.PROD = 0;
}

//core modules
const {DB, HTTP, FORM} = require('core/index');

//main handler
exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    let api;
    const [resource, action] = event.pathParameters['proxy'].split('/');
    const method = event.httpMethod;

    //OPTIONS requests are proccessed by API GateWay using mock
    //sam-local can't do it, so for local development we need this 
    if(method === 'OPTIONS'){
        return callback(null, HTTP.response());
    }  

    //require resource module
    try {
        api = require('api/' + resource)();
    } catch(e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            return callback(null, HTTP.response(404, {error: 'Resource not found.'}));
        }
        return callback(null, HTTP.response(500));
    }

    //call resource action
    if(api.hasOwnProperty(action)) {
		// Check token for protected action
		if(api[action].protected === 1){
			if (event.headers['X-Access-Token'] === undefined) {
				return callback(null, HTTP.response(403, {error: 'No token provided.'}));   
			}
            try {
                event.userData = jwt.verify(token, process.env.SECRET);       
            } catch(error) {
                return callback(null, HTTP.response(403, {error: 'Failed to verify token.'}));                
            }
		}
		
		// Check if this method is not allowed
		if (!api[action].hasOwnProperty(method)) {
			return callback(null, HTTP.response(405), {error: 'Method not allowed.'});
		}
		
		return api[action][method](event, context, callback); 
	}
	return callback(null, HTTP.response(404, {error: 'Action not found.'}));
}
