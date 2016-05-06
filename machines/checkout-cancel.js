module.exports = {

  friendlyName: 'Checkout Cancel',


  description: 'Cancel a checkout.',


  extendedDescription: 'This machine allows you to lookup the details of a specific checkout on WePay using the checkout_id. Response parameters marked "if available" will only show up if they have values.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user you want to capture a payment for.',
      required: true
    },

    checkoutId: {
      example: 12345,
      description: 'The unique ID of the checkout to get details for.',
      required: true
    },

    cancelReason: {
      example: 'Product was defective. Do not want.',
      description: 'The reason the payment is being cancelled.',
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
      description: 'Successfully cancelled checkout.',
      example: {
        "checkout_id":12345,
        "state":"cancelled"
      }
    }
  },


  fn: function(inputs, exits) {
    /**
    * Module Dependencies
    */

    var wepay = require('wepay').WEPAY;

    // wepay object options
    var wepay_options = {
      'access_token': inputs.accessToken
      // 'api_version': 'API_VERSION'
    };

    // wepay request params
    // requred
    var wepay_params = {
      'checkout_id': inputs.checkoutId,
      'cancel_reason': inputs.cancelReason
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

    wp.call('/checkout/cancel', wepay_params, function onResponse(response) {

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