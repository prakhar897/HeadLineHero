var brand = require('../data/brand.json');
var event = require('../data/event.json');
var generic = require('../data/generic.json');
var industry = require('../data/industry.json');
var location = require('../data/location.json');
var person = require('../data/person.json');
var skill = require('../data/skill.json');

var data = {}
data['brand'] = brand;
data['event'] = event;
data['generic'] = generic;
data['industry'] = industry;
data['location'] = location;
data['person'] = person;
data['skill'] = skill;

module.exports = data;
