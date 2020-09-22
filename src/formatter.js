
/**
 * Model attributes formatting
 */
import _ from 'underscore-99xp';
import formatFn from './format';

var formatter = {model: {}, collection: {}};
formatter.model.format = {};
formatter.model.formatMe = function () {
    this.attributes = this.formatData(this.attributes, {}, 0);
}
formatter.model.unformatMe = function (attrs) {
    this.attributes = this.formatData(this.attributes, {}, 1);
}
formatter.model.unformat = function (attrs) {
    return this.formatData(attrs || _.clone(this.attributes), {}, 1);
}

formatter.model.formatData = function (data, options, loadOrSave = 0) {
    if (data && 'format' in this && typeof this.format === 'object' && _.size(this.format) > 0) {
        var field;
        
        for (field in this.format) {
            let fieldFormatName = /\w+\[/.test(field) ? field.replace(/^(\w+)\[\d+\]/, '$1[]') : field;
            let fieldList;

            if (!(/.+\[\w+\]\[\d*\]/.test(fieldFormatName))) {
                let fieldMatch = /^\w+\[/.test(field) ? fieldFormatName.match(/^\w+\[/)[0] : field;
                fieldList = /^\w+\[/.test(field) ? _.deepKeySearch(fieldFormatName, data) : [fieldMatch];
            } else {
                fieldFormatName = /\[\w+\]\[\d+\]/.test(fieldFormatName) ? fieldFormatName.replace(/\[(\w+)\]\[\d+\]/, '[$1][]') : fieldFormatName;
                let fieldMatch = fieldFormatName.match(/.+\[\w+\]\[\]\[/)[0];

                fieldList = _.deepKeySearch(fieldFormatName, data);
            }

            for (let x in fieldList) {
                let fieldItem = fieldList[x];
//                }
                data = this.formatDataItem(fieldItem, loadOrSave, fieldFormatName, data, options);
            }
        }
    }

    return data;
}

formatter.model.formatDataItem = function (field, m=0, fieldFormatName, data, options) {
    typeof data === 'undefined' && (data = this.attributes);
    (!fieldFormatName) && (fieldFormatName = field);
    var format = this.format[fieldFormatName];
    var value = this.formatItem(field, m, data, format);
    
    if(typeof value !== 'undefined') {
        var o = {};
        o[field] = value;
        o = this.createJsonStack(o);
        data = _.defaults2(o, data);
    }

    return data;
}

/**
 * format a field value
 * @param string field name of the field that will be format
 * @param int m created to relate to the moment you are at. loading data from server or sending it to it [0 => loading, 1 => sending]
 * @param object data object that contains all data from a model
 */
formatter.model.formatItem = function (field, m, data, format) {
    typeof data === 'undefined' && (data = this.attributes);
    typeof format === 'undefined' && (format = this.format[field]);

    var value = _.deepValueSearch(field, data);
    if(typeof value !== 'undefined') {
        value = formatFn(value, format, m);
    }
    return value;
}

/**
 * apply format to all models into a collection
 */
formatter.collection.formatModels = function () {
    if (!this.models)
        return;
    for (let model of this.models) {
        model.formatMe();
    }
}
formatter.collection.unformatModels = function () {
    if (!this.models)
        return;
    for (let model of this.models) {
        model.unformatMe();
    }
}

formatter.model.parse = function(response, options) {
    typeof this.formatData === 'function' && (response = this.formatData(response, options, 0));
    return response;
}

formatter.model.toJSON = function(options) {
    var json = _.clone(this.attributes);
    typeof this.formatData === 'function' && (json = this.formatData(json1, options, 1));
    return json;
}

export default formatter;