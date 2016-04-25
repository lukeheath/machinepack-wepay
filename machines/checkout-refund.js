module.exports = {

  friendlyName: 'Refund Checkout',


  description: 'Refunds the payment associated with the checkout created by the application. Checkout must be in "captured" state.',


  extendedDescription: 'Refunds the payment associated with the checkout created by the application. Checkout must be in "captured" state.',


  inputs: {

    accessToken: {
      example: '604f39f41e364951ced74070c6e8bfa49d346cdfee6191b03c2c2d9c9cda9184',
      description: 'The string access token of the user issuing the checkout refund.',
      required: true
    },

    checkoutId: {
      example: 1548718026,
      description: 'The unique ID of the checkout you want to refund.',
      required: true
    },

    refundReason: {
      example: 'Accidental payment',
      description: 'The reason the payment is being refunded.',
      required: true
    },

    amount: {
      example: 4.99,
      description: 'The total amount that will be refunded back to the payer.',
      extendedDescription: 'Note that this amount must be less than the "net" of the transaction. To perform a full refund, do not pass the amount parameter.',
      required: false
    },

    appFee: {
      example: 1.99,
      description: 'The portion of the "amount" that will be refunded as an app_fee refund.',
      required: false
    },

    payerEmailMessage: {
      example: 'Here is your refund.',
      description: 'A short message that will be included in the payment refund email to the payer.',
      required: false
    },

    payeeEmailMessage: {
      example: 'A refund was issued.',
      description: 'A short message that will be included in the payment refund email to the payee.',
      required: false
    }

  },


  exits: {

    error: {
      description: 'An unexpected error occurred.'
    },

    success: {
      description: 'Checkout refunded.',
      example: {
        "checkout_id":12345,
        "state":"refunded"
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
      'checkout_id': inputs.checkoutId,
      'refund_reason': inputs.refundReason,
      'amount': inputs.amount || undefined,
      'app_fee': inputs.appFee || undefined,
      'payer_email_message': inputs.payerEmailMessage || undefined,
      'payee_email_message': inputs.payeeEmailMessage || undefined
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

    wp.call('/checkout/refund', wepay_params, function onResponse(response) {

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