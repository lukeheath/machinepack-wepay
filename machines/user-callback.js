module.exports = {

  friendlyName: 'User Callback URI',


  description: 'Allows you to add a callback_uri to the user object..',


  extendedDescription: 'If you add a callback_uri you will receive IPNs with the user_id each time the user revokes their access_token or is deleted.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user you want to send confirmation to.',
      required: true
    },

    callbackUri: {
      example: 'https://www.wepay.com/ipn/12345',
      description: 'The callback_uri you want to receive IPNs on. Must be a full URI.',
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

    wp.call('/user/modify', {
      'callback_uri': inputs.callbackUri
    }, function onResponse(response) {

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