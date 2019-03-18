'use strict';
var assert = require('assert');
var sinon = require('sinon');
var getNepdayOfWeek = require('./');

it('should return Tuesday for index 2', function () {
  var obj = {full: 'मंगलबार', short: 'मंगल', min: 'मं'};
  assert.deepEqual(getNepdayOfWeek(2), obj);
  assert.strictEqual(typeof getNepdayOfWeek(2), 'object');
  obj = {full: 'Mangalbaar', short: 'Mangal', min: 'Man'};
  assert.deepEqual(getNepdayOfWeek(2, {lang: 'en'}), obj);
  assert.strictEqual(getNepdayOfWeek(2, {lang: 'en', type: 'short'}), 'Mangal');
  assert.strictEqual(getNepdayOfWeek(2, {type: 'min'}), 'मं');
  assert.strictEqual(getNepdayOfWeek(2, {type: 'full'}), 'मंगलबार');
  assert.strictEqual(getNepdayOfWeek(2, {type: 'full', lang: 'en'}), 'Mangalbaar');
});

it('should return TypeError for invalid input', function () {
  assert.deepEqual(getNepdayOfWeek('samar'), new TypeError('Expected a date object or a number'));
});

it('should return RangeError for invalid range', function () {
  assert.deepEqual(getNepdayOfWeek(-10), new RangeError('Expected the value of inp between 0-6'));
  assert.deepEqual(getNepdayOfWeek(7), new RangeError('Expected the value of inp between 0-6'));
});

it('should return correct output for Date object', function () {
  assert.strictEqual(getNepdayOfWeek(new Date('2015/10/25'), {lang: 'en', type: 'full'}), 'Aaitabaar');
  assert.strictEqual(getNepdayOfWeek(new Date('2015/10/26'), {lang: 'ne', type: 'short'}), 'सोम');
  assert.strictEqual(getNepdayOfWeek(new Date('2015/10/23'), {lang: 'ne', type: 'min'}), 'शु');
});

it('should return correct output for current day', function () {
  var clock = sinon.useFakeTimers(new Date('2015/10/24').getTime());
  assert.strictEqual(getNepdayOfWeek({lang: 'en', type: 'min'}), 'Sha');
  assert.deepEqual(getNepdayOfWeek(new Date()), {full: 'शनिबार', short: 'शनि', min: 'श'});
  clock.restore();
});
