module.exports = {

  friendlyName: 'Create Checkout',


  description: 'Create a checkout for an account.',


  extendedDescription: 'There are two ways to have your customers make a payment. You can have the checkout url hosted by WePay or you can use a previously acquired payment method, such as a preapproval or a credit card.',


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

    shortDescription: {
      example: '2 dozen bisquits',
      description: 'A short description of what is being paid for. Max 255 chars.',
      required: true
    },

    type: {
      example: 'goods',
      description: 'The checkout type (one of the following: goods, service, donation, event or personal). Must be in lowercase.',
      required: true
    },

    amount: {
      example: 9.99,
      description: 'The amount that the payer will pay.',
      required: true
    },

    currency: {
      example: 'USD',
      description: 'The currency used. Possible values: USD, CAD',
      required: true
    },

    longDescription: {
      example: 'This recipe will produce the biggest biscuits in the history of the world! Serve these gems with butter, preserves, gravy or they can also be used as dinner rolls...you get the picture.',
      description: 'A long description of what is being paid for. Max 2047 chars.',
      required: false
    },

    emailMessage: {
      example: {"to_payee": "test","to_payer": "test"},
      description: 'Specifies a short message to send to the payee and payer when a checkout is successful. More at https://stage.wepay.com/developer/reference/structures#email_message',
      required: false
    },

    fee: {
      example: {"app_fee": 20,"fee_payer": "payer"},
      description: 'Specify whether an app fee will be collected and who should pay the app fee. For EMV transactions, this parameter must be present. More at https://stage.wepay.com/developer/reference/structures#fee',
      required: false
    },

    callbackUri: {
      example: 'https://www.baggins.com/callback',
      description: 'The uri that will receive any instant payment notifications sent. Needs to be a full uri (ex https://www.wepay.com ) and must NOT be localhost or 127.0.0.1 or include wepay.com.',
      required: false
    },

    autoCapture: {
      example: false,
      description: 'A boolean value (true or false) default is true.',
      extendedDescription: 'A boolean value (true or false) default is true. If set to false then the payment will not automatically be released to the account and will be held by WePay in payment state "reserved". To release funds to the account you must call /checkout/capture. If you do not capture the funds within 14 days then the payment will be automatically cancelled or refunded.',
      required: false
    },

    referenceId: {
      example: '1234abcd',
      description: 'Reference id for this checkout.',
      required: false
    },

    uniqueId: {
      example: 'abcdef123456',
      description: 'Customer-generated unique_id. WePay will only process a single call with a given unique_id. Platforms can use this to prevent duplicates, e.g. when retrying if a call times out. See below for tips on handling errors.',
      required: false
    },

    hostedCheckout: {
      example: {"redirect_uri": "http://www.test.com","fallback_uri": "http://www.test.com"},
      description: 'Use this to have payers enter payment information on a WePay hosted checkout URL. Send either hosted_checkout or payment_method parameter. Do not send both parameters at the same time. If neither parameter is specified, default behavior will be hosted_checkout. Full example object at https://stage.wepay.com/developer/reference/structures#hosted_checkout.',
      required: false
    },

    paymentMethod: {
      example: {"type": "credit_card","credit_card": {"id": 1334}},
      description: 'Use this to pay using previously acquired payment information, such as a preapproval or a credit card.',
      extendedDescription: 'Use this to pay using previously acquired payment information, such as a preapproval or a credit card. Send either hosted_checkout or payment_method parameter. Do not send both parameters at the same time. If neither parameter is specified, default behavior will be hosted_checkout.',
      required: false
    },

    deliveryType: {
      example: 'none',
      description: 'Delivery type for checkout. Possible values: none, fully_delivered, point_of_sale, shipping, donation, subscription, partial_prepayment, full_prepayment. Must be in lower case.',
      required: false
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
      description: 'Checkout created',
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
    var wepay_params = {
      'account_id': inputs.accountId,
      'short_description': inputs.shortDescription,
      'type': inputs.type,
      'amount': inputs.amount,
      'currency': inputs.currency,
      'long_description': inputs.longDescription || undefined,
      'email_message': inputs.emailMessage || undefined,
      'fee': inputs.fee || undefined,
      'callback_uri': inputs.callbackUri || undefined,
      'auto_capture': inputs.autoCapture ? true : false, // Booleans need ternary or false evaluated to undefined
      'reference_id': inputs.referenceId || undefined,
      'unique_id': inputs.uniqueId || undefined,
      'hosted_checkout': inputs.hostedCheckout || undefined,
      'payment_method': inputs.paymentMethod || undefined,
      'delivery_type': inputs.deliveryType || undefined
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

    wp.call('/checkout/create', wepay_params, function onResponse(response) {

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