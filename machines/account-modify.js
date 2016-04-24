module.exports = {

  friendlyName: 'Modify Account',


  description: 'Modify an existing payment account.',


  extendedDescription: 'Update the specified properties. If reference_id is passed, it must be unique for the user/application pair.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user you want to create a payment account for.',
      required: true
    },

    accountId: {
      example: 12345,
      description: 'The unique ID of the account you want to modify.',
      required: true
    },

    name: {
      example: 'My new payment account name',
      description: 'The name for the account.',
      required: false
    },

    description: {
      example: 'My new payment account description',
      description: 'The description for the account.',
      required: false
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

    imageUri: {
      example: 'http://s3.amazonaws.com/myphoto.jpg',
      description: 'The uri for an image that you want to use for the accounts icon. This image will be used in the co-branded checkout process.',
      required: false
    },

    gaqDomains: {
      example: '["mydomain.com", "myotherdomain.com"]',
      description: 'An array of Google Analytics domains associated with the account. See the analytics tutorial for more details.',
      required: false
    },

    themeObject: {
      example: '{"theme_id":12345,"name":"API Theme for API App: My Sample Application","primary_color":"FFFFFF","secondary_color":"000000","background_color":"004C64","button_color":"0084A0"}',
      description: 'The theme structure (a JSON object, not a JSON serialized string) you want to be used for account\'s flows and emails. See https://stage.wepay.com/deeloper/reference/structures#theme.',
      required: false
    },

    callbackUri: {
      example: 'https://www.baggins.com/callback',
      description: 'The uri that will receive IPNs for this account. You will receive an IPN whenever the account is verified or deleted.',
      required: false
    },

    countryOptions: {
      example: '{"debit_opt_in":true|false}',
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
      "name":"Example Account",
      "description":"This is just an example WePay account.",
      "reference_id":"abc123",
      "image_uri":"https://stage.wepay.com/img/logo.png",
      "country":"US",
      "currencies":[
        "USD"
      ],
      "fee_schedule_slot": 9
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

    // Optional inputs

    if(inputs.name){
      wepay_params.name = inputs.name;
    }

    if(inputs.description){
      wepay_params.description = inputs.description;
    }

    if(inputs.referenceId){
      wepay_params.reference_id = inputs.referenceId;
    }
    if(inputs.imageUri){
      wepay_params.image_uri = inputs.image_uri;
    }

    if(inputs.gaqDomains){
      wepay_params.gaq_domains = inputs.gaqDomains;
    }

    if(inputs.themeObject){
      wepay_params.theme_object = inputs.themeObject;
    }

    if(inputs.callbackUri){
      wepay_params.callback_uri = inputs.callbackUri;
    }

    if(inputs.countryOptions){
      wepay_params.country_options = inputs.countryOptions;
    }

    if(inputs.feeScheduleSlot){
      wepay_params.fee_schedule_slot = inputs.feeScheduleSlot;
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

    wp.call('/account/modify', wepay_params, function onResponse(response) {

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