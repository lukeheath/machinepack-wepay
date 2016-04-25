module.exports = {

  friendlyName: 'Find Checkout',


  description: 'Search for checkouts associated with an account. Returns an array of matching checkouts.',


  extendedDescription: 'An array of checkouts matching the search parameters. Each element of the array will include the same data as returned from the Create Checkout machine.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user accepting the checkout payment.',
      required: true
    },

    accountId: {
      example: 1548718026,
      description: 'The unique ID of the account you want to create a checkout for.',
      required: true
    },

    start: {
      example: 10,
      description: 'The start position for your search (default 0).',
      required: false
    },

    limit: {
      example: 25,
      description: 'The maximum number of returned entries (default 50).',
      required: false
    },

    referenceId: {
      example: '123abc',
      description: 'The unique reference id of the checkout (set by Create Checkout machine).',
      required: false
    },

    state: {
      example: 'active',
      description: 'What state the checkout is in.',
      required: false,
       whereToGet: {
        url: 'https://www.wepay.com/developer/reference/checkout#states',
        description: 'View a list of possible states in WePay docs.'
      }
    },

    preapprovalId: {
      example: 123,
      description: 'The ID of the preapproval that was used to create the checkout. Useful if you want to look up all of the payments for an auto_recurring preapproval.',
      required: false
    },

    startTime: {
      example: 1209600,
      description: 'All checkouts after a given unix timestamp.',
      required: false
    },

    endTime: {
      example: 1209600,
      description: 'All checkouts before a given unix timestamp.',
      required: false
    },

    sortOrder: {
      example: 'DESC',
      description: 'Sort the results of the search by time created. Use "DESC" for most recent to least recent. Use "ASC" for least recent to most recent. Defaults to "DESC".',
      required: false
    },

    shippingFee: {
      example: 2.99,
      description: 'All checkouts that have the given shipping fee.',
      required: false
    }

  },


  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      description: 'Checkout created',
      example: [{
        "checkout_id": 513220415,
        "account_id": 1548718026,
        "type": "donation",
        "short_description": "test payment",
        "currency": "USD",
        "amount": 20,
        "state": "captured",
        "soft_descriptor": "WPY*Wolverine",
        "auto_capture": true,
        "create_time": 1439582902,
        "delivery_type": "point_of_sale",
        "gross": 23.96,
        "long_description": "This is a test payment.",
        "reference_id": "123abc",
        "callback_uri": "http://www.example.com",
        "fee": {
          "app_fee": 1,
          "fee_payer": "payer",
          "processing_fee": 0.96
        },
        "chargeback": {
          "amount_charged_back": 0,
          "dispute_uri": "http://wepay.com/dispute/payer_create/148/81bdda6feea880d5d586"
        },
        "refund": {
          "amount_refunded": 0,
          "refund_reason": "null"
        },
        "hosted_checkout": {
          "checkout_uri": "http://wepay.com/api/iframe/513220415/8a8d959e/api_checkout?iframe=1",
          "redirect_uri": "http://www.test.com",
          "shipping_fee": 2,
          "require_shipping": true,
          "shipping_address": {
            "name": "Test Smith",
            "address1": "Main Street",
            "address2": "",
            "city": "Sunnyvale",
            "country": "US",
            "state": "CA",
            "zip": "94085"
          },
          "theme_object": {
            "theme_id": 21146702,
            "name": "test",
            "primary_color": "ffffff",
            "secondary_color": "000000",
            "background_color": "ffffff",
            "button_color": "000000"
          },
          "mode": "iframe"
        },
        "payer": {
          "email": "test@test.com",
          "name": "Test Smith",
          "home_address": "null"
        },
        "npo_information": "null",
        "payment_error": "null"
      }]
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
    var wepay_params = {
      'account_id': inputs.accountId,
      'start': inputs.start || undefined,
      'limit': inputs.limit || undefined,
      'reference_id': inputs.referenceId || undefined,
      'state': inputs.state || undefined,
      'preapproval_id': inputs.preapprovalId || undefined,
      'start_time': inputs.startTime || undefined,
      'end_time': inputs.endTime || undefined,
      'sort_order': inputs.sortOrder || undefined,
      'shipping_fee': inputs.shippingFee || undefined
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

    wp.call('/checkout/find', wepay_params, function onResponse(response) {

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