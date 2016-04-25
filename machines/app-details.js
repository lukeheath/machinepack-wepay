module.exports = {

  friendlyName: 'Application Details',


  description: 'Get details about a WePay application.',


  extendedDescription: 'Look up details about a WePay application by client id and secret',


  inputs: {

    clientId: {
      example: 123456,
      description: 'The integer client ID issued to the app, found on your application\'s dashboard',
      required: true
    },

    clientSecret: {
      example: '6446c521bd',
      description: 'The string client secret issued to the app, found on your application\'s dashboard',
      required: true
    },

    useProduction: {
      example: false,
      description: 'Use WePay production API - payments will be charged. Defaults to WePay staging - payments are not charged.',
      required: false
    }

  },


  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      description: 'Successfully retrieved application Details.',
      example: {
        "api_version":567235,
        "client_id":"604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184",
        "state":"BEARER",
        "status":1209600,
        "theme_object": {},
        "gaq_domains": ''
      } 
    }
  },


  fn: function(inputs, exits) {
    /**
    * Module Dependencies
    */

    var wepay = require('wepay').WEPAY;

    // wepay request settings
    var wepay_settings = {
      'client_id': inputs.clientId,
      'client_secret': inputs.clientSecret
      // 'api_version': 'API_VERSION'
    };

    // Instantiate new wepay instance with settings
    var wp = new wepay(wepay_settings);

    // Set API environment
    if(inputs.useProduction){
      wp.use_production();
    }
    else{
      wp.use_staging();
    }

    wp.call('/app',
    {
      'client_id': inputs.clientId,
      'client_secret': inputs.clientSecret
    },
    function(response) {

      var responseObj = JSON.parse(String(response));

      if(responseObj.error){
        return exits.error(responseObj);
      }
      else{
        return exits.success(responseObj);
      }

    });
  },



};