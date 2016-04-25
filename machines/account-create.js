module.exports = {

  friendlyName: 'Create Account',


  description: 'Create a new payment account.',


  extendedDescription: 'Create a new payment account for the user associated with the access token used to make this call.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user you want to create a payment account for.',
      required: true
    },

    name: {
      example: 'My Payment Account',
      description: 'The name of the account you want to create.',
      required: true
    },

    description: {
      example: 'My payment account is for money.',
      description: 'The description of the account you want to create.',
      required: true
    },

    useProduction: {
      example: false,
      description: 'Use WePay production API - payments will be charged. Defaults to WePay staging - payments are not charged.',
      required: false
    },

    referenceId: {
      example: 'ABCD1234',
      description: 'The reference id of the account. Can be any string, but must be unique for the application/user pair.',
      required: false
    },

    type: {
      example: 'business',
      description: 'The type of account you are creating. Can be "nonprofit", "business", or "personal".',
      required: false
    },

    imageUri: {
      example: 'http://s3.amazonaws.com/myphoto.jpg',
      description: 'The uri for an image that you want to use for the accounts icon. This image will be used in the co-branded checkout process.',
      required: false
    },

    gaqDomains: {
      example: ["mydomain.com", "myotherdomain.com"],
      description: 'An array of Google Analytics domains associated with the account. See the analytics tutorial (https://stage.wepay.com/developer/reference/analytics) for more details.',
      required: false
    },

    themeObject: {
      example: {"theme_id":12345,"name":"API Theme for API App: My Sample Application","primary_color":"FFFFFF","secondary_color":"000000","background_color":"004C64","button_color":"0084A0"},
      description: 'The theme structure (a JSON object, not a JSON serialized string) you want to be used for account\'s flows and emails. See https://stage.wepay.com/deeloper/reference/structures#theme.',
      required: false
    },

    mcc: {
      example: 7392,
      description: 'The mcc code that is relevant to the type of account this is. See the mcc reference page (https://stage.wepay.com/developer/reference/mcc) for more information.',
      required: false
    },

    callbackUri: {
      example: 'https://www.baggins.com/callback',
      description: 'The uri that will receive IPNs for this account. You will receive an IPN whenever the account is verified or deleted.',
      required: false
    },

    country: {
      example: 'US',
      description: 'The account\'s country of origin 2-letter ISO code (e.g. "US" or "CA")',
      required: false
    },

    currencies: {
      example: ["USD"],
      description: 'Array of supported currency strings for this account (e.g. ["USD"]) Both "USD" and "CAD" are currently supported. Only one currency string per account is allowed at this time.',
      required: false
    },

    countryOptions: {
      example: {"debit_opt_in":true|false},
      description: '{"debit_opt_in":true|false}. Used for Canadian accounts only.',
      required: false
    },

    feeScheduleSlot: {
      example: 9,
      description: 'The custom fee schedule value to use for the merchant. Values start at 0, not 1. Passing null will remove the custom fee schedule. NOTE: Use of this parameter requires permission from WePay.',
      required: false
    }

  },


  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      description: 'Successfully created payment account.',
      example: {
      "account_id":12345,
      "name":"Example account",
      "state":"active",
      "description":"this account is just an example.",
      "owner_user_id":539291,
      "reference_id":"123abc",
      "type":"personal",
      "create_time":1367958263,
      "disablement_time":"null",
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
      'name': inputs.name,
      'description': inputs.description,
      'reference_id': inputs.referenceId || undefined,
      'type': inputs.type || undefined,
      'image_uri': inputs.imageUri || undefined,
      'gaq_domains': inputs.gaqDomains || undefined,
      'theme_object': inputs.themeObject || undefined,
      'mcc': inputs.mcc || undefined,
      'callback_uri': inputs.callbackUri || undefined,
      'country': inputs.country || undefined,
      'currencies': inputs.currencies || undefined,
      'country_options': inputs.countryOptions || undefined,
      'fee_schedule_slot': inputs.feeScheduleSlot || undefined
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

    wp.call('/account/create', wepay_params, function onResponse(response) {

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