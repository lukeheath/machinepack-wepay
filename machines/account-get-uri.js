module.exports = {

  friendlyName: 'Get Account URI',


  description: 'Get account URI to update account at WePay.',


  extendedDescription: 'Add or update all incomplete items for an account like KYC info, bank account, etc. It will return a URL that a user can visit to update info for his or her account.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'String access token of the user with permission to delete this account.',
      required: true
    },

    accountId: {
      example: 12345,
      description: 'Unique ID of the account you want to delete.',
      required: true
    },

    mode: {
      example: 'regular',
      description: 'Mode the process will be displayed in. The options are \'iframe\' or \'regular\'. Choose iframe if you would like to frame the process on your site. Mode defaults to \'regular\'.',
      required: false
    },

    redirectUri: {
      example: 'https://www.baggins.com/updated',
      description: 'URI the user will be redirected to after completing the process.',
      required: false
    }

  },


  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      "account_id":12345,
      "uri":"http://stage.wepay.com/api/account_update_uri/12345"
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

    if(inputs.mode){
      wepay_params.mode = inputs.mode;
    }

    if(inputs.redirectUri){
      wepay_params.redirect_uri = inputs.redirectUri;
    }

    // Instantiate new wepay instance with options
    var wp = new wepay(wepay_options);

    // Set API environment
    if(inputs.useProduction){
      wp.use_production();
    }
    else{
      wp.use_staging();
    }

    wp.call('/account/get_update_uri', wepay_params, function onResponse(response) {

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