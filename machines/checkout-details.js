module.exports = {

  friendlyName: 'Checkout Details',


  description: 'Get details about a checkout.',


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
      description: 'Successfully retrieved checkout details.',
      example: {
        "checkout_id": 649945633,
        "account_id": 1548718026,
        "type": "donation",
        "short_description": "test",
        "currency": "USD",
        "amount": 20,
        "state": "new",
        "soft_descriptor": "WPY*Wolverine",
        "auto_capture": true,
        "create_time": 1439582388,
        "delivery_type": "point_of_sale",
        "long_description": "test",
        "callback_uri": "http://www.test.com",
        "reference_id": "null",
        "fee": {
          "app_fee": 1,
          "fee_payer": "payer",
          "processing_fee": 0
        },
        "gross": 0,
        "chargeback": {
          "amount_charged_back": 0,
          "dispute_uri": "null"
        },
        "refund": {
          "amount_refunded": 0,
          "refund_reason": "null"
        },
        "hosted_checkout": {
          "checkout_uri": "http://wepay.com/api/iframe/649945633/51e59317/api_checkout?iframe=1",
          "redirect_uri": "http://www.test.com",
          "shipping_fee": 2,
          "require_shipping": true,
          "shipping_address": "null",
          "theme_object": {
            "theme_id": 96914023,
            "name": "test",
            "primary_color": "ffffff",
            "secondary_color": "000000",
            "background_color": "ffffff",
            "button_color": "000000"
          },
          "mode": "iframe"
        },
        "payer": {
          "name": "null",
          "email": "null",
          "home_address": "null"
        },
        "npo_information":{
        "legal_name": "org name",
        "ein": "343644743"
        },
        "payment_error": "null"
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

    wp.call('/checkout', wepay_params, function onResponse(response) {

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