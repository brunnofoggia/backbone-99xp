
/**
 * 
 */
import _ from 'underscore-99xp';
import validate from 'validate-99xp';

var validation = _.clone(validate);
validation.validateAll = true;
validation.validations = function() { return {}; };

export default validation;