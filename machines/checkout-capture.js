module.exports = {

  friendlyName: 'Capture Checkout',


  description: 'Capture a checkout that was not auto captured.',


  extendedDescription: 'If auto_capture was set to false when the checkout was created, you will need to make this call to release funds to the account. Until you make this call the money will be held by WePay and if you do not capture the funds within 14 days then the payment will be automatically cancelled or refunded. You can only make this call if the checkout is in state \'reserved\'.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user you want to capture a payment for.',
      required: true
    },

    checkoutId: {
      example: 12345,
      description: 'The unique ID of the checkout to be captured.',
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
      description: 'Checkout successfully captured.',
      example: {
        "checkout_id":12345,
        "state":"captured"
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
      'checkout_id': inputs.checkoutId
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

    wp.call('/checkout/capture', wepay_params, function onResponse(response) {

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