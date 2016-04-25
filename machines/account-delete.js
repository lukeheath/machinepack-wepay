module.exports = {

  friendlyName: 'Delete Account',


  description: 'Delete an existing payment account.',


  extendedDescription: 'Delete the account specified. The user associated with the access token used must have permission to delete the account. An account may not be deleted if it has a balance or pending payments.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user with permission to delete this account.',
      required: true
    },

    accountId: {
      example: 12345,
      description: 'The unique ID of the account you want to delete.',
      required: true
    },

    reason: {
      example: 'No longer being used.',
      description: 'Reason for deleting the account.',
      required: false
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
      description: 'Successfully deleted payment account.',
      example: {
        "account_id":12345,
        "state":"deleted"
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
      'reason': inputs.reason || undefined
    };

    // Instantiate new wepay instance with options
    var wp = new wepay(wepay_options);

    // Set API environment
    if(inputs.useProduction){
      wp.use_production();
    }
    else{
      wp.use_staging();
    }

    wp.call('/account/delete', wepay_params, function onResponse(response) {

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