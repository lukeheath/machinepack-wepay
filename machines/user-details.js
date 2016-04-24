module.exports = {

  friendlyName: 'User Details',


  description: 'Look up details about a user by access token.',


  extendedDescription: 'Look up the details of the user associated with the access token you are using to make the call.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user you want to send confirmation to.',
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
      "user_id":12345,
      "first_name":"Bill",
      "last_name":"Clerico",
      "email":"api@wepay.com",
      "state":"registered",
      "callback_uri":"https://www.everribbon.com/ipn/12345"
    }
  },


  fn: function(inputs, exits) {
    /**
    * Module Dependencies
    */

    var wepay = require('wepay').WEPAY;

    // wepay request settings
    var wepay_settings = {
      'access_token': inputs.accessToken
      // 'api_version': 'API_VERSION'
    }

    // Instantiate new wepay instance with settings
    var wp = new wepay(wepay_settings);

    // Set API environment
    if(inputs.useProduction){
      wp.use_production();
    }
    else{
      wp.use_staging();
    }

    wp.call('/user', {}, function onResponse(response) {

      var responseObj = JSON.parse(String(response));

      if(responseObj.error){
        return exits.error(responseObj)
      }
      else{
        return exits.success(responseObj);
      }

    });
  },



};