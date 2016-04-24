module.exports = {

  friendlyName: 'Merchant Register',


  description: 'Register a new merchant account that can accept payments.',


  extendedDescription: 'Register a new merchant accounts with WePay and returns an access token.',


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

    email: {
      example: 'bilbo@baggins.com',
      description: 'The email of the user you want to register',
      required: true
    },

    scope: {
      example: 'manage_accounts,collect_payments,view_user,send_money,preapprove_payments',
      description: 'A comma separated list of permissions.',
      required: true
    },

    firstName: {
      example: 'Bilbo',
      description: 'The first name of the user you want to register',
      required: true
    },

    lastName: {
      example: 'Baggins',
      description: 'The last name of the user you want to register',
      required: true
    },

    originalIp: {
      example: '74.125.224.84',
      description: 'The IP address of the user you want to register',
      required: true
    },

    originalDevice: {
      example: 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.597.102 Safari/534.13',
      description: 'The user-agent (for web) or the IMEI (for mobile) of the user you want to register',
      required: true
    },

    tosAcceptanceTime: {
      example: 1209600,
      description: 'A Unix timestamp referencing the time the user accepted WePay\'s terms of service.',
      required: true
    },

    useProduction: {
      example: false,
      description: 'Use WePay production API - payments will be charged. Defaults to WePay staging - payments are not charged.',
      required: false
    },

    redirectUri: {
      example: 'https://www.baggins.com/thanks',
      description: 'The uri the user will be redirected to after they have confirmed they wanted to be registered on WePay. By default this will be your application\'s homepage.',
      required: false
    },

    callbackUri: {
      example: 'https://www.baggins.com/callback',
      description: 'The callback_uri you want to receive IPNs on. Must be a full URI.',
      required: false
    }

  },


  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      "user_id":567235,
      "access_token":"604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184",
      "token_type":"BEARER",
      "expires_in":1209600
    }
  },


  fn: function(inputs, exits) {
    /**
    * Module Dependencies
    */

    var wepay = require('wepay').WEPAY;

    // wepay object options
    var wepay_options = {
      'client_id': inputs.clientId,
      'client_secret': inputs.clientSecret
      // 'api_version': 'API_VERSION'
    };

    // wepay request params
    var wepay_params = {
      'client_id': inputs.clientId,
      'client_secret': inputs.clientSecret,
      'email': inputs.email,
      'scope': inputs.scope,
      'first_name': inputs.firstName,
      'last_name': inputs.lastName,
      'original_ip': inputs.originalIp,
      'original_device': inputs.originalDevice,
      'tos_acceptance_time': inputs.tosAcceptanceTime,
      'direct_uri': inputs.redirectUri || undefined,
      'callback_uri': inputs.callbackUri || undefined
    };

    // Instantiate new wepay instance with settings
    var wp = new wepay(wepay_options);

    // Set API environment
    if(inputs.useProduction){
      wp.use_production();
    }
    else{
      wp.use_staging();
    }

    wp.call('/user/register', wepay_params, function onResponse(response) {

      // Convert buffer respond to JSON object
      var responseObj = JSON.parse(String(response));

      // Catch error
      if(responseObj.error){
        return exits.error(responseObj);
      }
      // Else success
      else{
        return exits.success(responseObj);
      }

    });
  },



};