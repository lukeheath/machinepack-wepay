module.exports = {

  friendlyName: 'User Confirmation Send',


  description: 'Send confirmation email to users registered with Register User machine.',


  extendedDescription: 'For users who were registered via the /user/register call, this API call must be used to send the registration confirmation email. This call can also be used later to resend the registration confirmation email as needed.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user you want to send confirmation to.',
      required: true
    },

    emailMessage: {
      example: 'Welcome to my <strong>application</strong>',
      description: 'A short message that will be included in the email to the user.',
      required: true
    },

    useProduction: {
      example: false,
      description: 'Use WePay production API - payments will be charged. Defaults to WePay staging - payments are not charged.',
      required: false
    },

  },


  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      description: 'User confirmation email sent.',
      example: {
        "user_id":12345,
        "first_name":"Bill",
        "last_name":"Clerico",
        "email":"api@wepay.com",
        "state":"registered"
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
      'access_token': inputs.accessToken
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

    wp.call('/user/send_confirmation',
    {
      'email_message': inputs.emailMessage
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