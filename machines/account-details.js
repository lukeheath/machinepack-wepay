module.exports = {

  friendlyName: 'Account Details',


  description: 'Look up the details of a payment account on WePay.',


  extendedDescription: 'Look up the details of a payment account on WePay. The payment account must belong to the user associated with the access token used to make the call.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user you want to create a payment account for.',
      required: true
    },

    accountId: {
      example: 12345,
      description: 'The string access token of the user you want to create a payment account for.',
      required: true
    }

  },


  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      "account_id":12345,
      "name":"Example account",
      "state":"active",
      "description":"this account is just an example.",
      "owner_user_id":539291,
      "reference_id":"123abc",
      "type":"personal",
      "create_time":1367958263,
      "disablement_time":null,
      "country":"US",
      "currencies":[
        "USD"
      ],
      "balances":[
        {
          "currency":"USD",
          "balance":390.50,
          "incoming_pending_amount":635.30,
          "outgoing_pending_amount":210.00,
          "reserved_amount":0,
          "disputed_amount":0,
          "withdrawal_period":"daily",
          "withdrawal_type":"ach",
          "withdrawal_next_time":1370112217,
          "withdrawal_bank_name":"WellsFargo XXXXX3102"
        }
      ],
      "statuses":[
        {
          "currency":"USD",
          "incoming_payments_status":"ok",
          "outgoing_payments_status":"ok",
          "account_review_status":"pending"
        }
      ],
      "image_uri": "https:\/\/stage.wepay.com\/img\/logo.png",
      "action_reasons":[
        "bank_account",
        "kyc"
      ],
      "supported_card_types":[
         "visa",
         "mastercard",
         "american_express",
         "discover",
         "jcb",
         "diners_club"
      ],
      "disabled_reasons":[
        "country_not_supported",
        "fraud",
        "high_risk_chargeback",
        "no_settlement_path",
        "reported_user",
        "tos_violation"
      ],
      "fee_schedule":[
        {
            "slot": 9,
            "description": "2.9% + $0.30",
            "currency": "USD"
        }
      ]
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
    }

    // wepay request params
    // requred
    var wepay_params = {
      'account_id': inputs.accountId
    }

    // Instantiate new wepay instance with settings
    var wp = new wepay(wepay_options);

    // Set API environment
    if(inputs.useProduction){
      wp.use_production();
    }
    else{
      wp.use_staging();
    }

    wp.call('/account', wepay_params, function onResponse(response) {

      // Convert buffer respond to JSON object
      var responseObj = JSON.parse(String(response));

      // Catch error
      if(responseObj.error){
        return exits.error(responseObj)
      }
      // Else success
      else{
        return exits.success(responseObj);
      }

    });
  },



};