/**
 * All Validations file
 */
var express = require("express");
var app = express();
var pattern= /^\d{3}-\d{2}-\d{4}$/;

var usStates = [
                { name: 'ALABAMA', abbreviation: 'AL'},
                { name: 'ALASKA', abbreviation: 'AK'},
                { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
                { name: 'ARIZONA', abbreviation: 'AZ'},
                { name: 'ARKANSAS', abbreviation: 'AR'},
                { name: 'CALIFORNIA', abbreviation: 'CA'},
                { name: 'COLORADO', abbreviation: 'CO'},
                { name: 'CONNECTICUT', abbreviation: 'CT'},
                { name: 'DELAWARE', abbreviation: 'DE'},
                { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
                { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
                { name: 'FLORIDA', abbreviation: 'FL'},
                { name: 'GEORGIA', abbreviation: 'GA'},
                { name: 'GUAM', abbreviation: 'GU'},
                { name: 'HAWAII', abbreviation: 'HI'},
                { name: 'IDAHO', abbreviation: 'ID'},
                { name: 'ILLINOIS', abbreviation: 'IL'},
                { name: 'INDIANA', abbreviation: 'IN'},
                { name: 'IOWA', abbreviation: 'IA'},
                { name: 'KANSAS', abbreviation: 'KS'},
                { name: 'KENTUCKY', abbreviation: 'KY'},
                { name: 'LOUISIANA', abbreviation: 'LA'},
                { name: 'MAINE', abbreviation: 'ME'},
                { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
                { name: 'MARYLAND', abbreviation: 'MD'},
                { name: 'MASSACHUSETTS', abbreviation: 'MA'},
                { name: 'MICHIGAN', abbreviation: 'MI'},
                { name: 'MINNESOTA', abbreviation: 'MN'},
                { name: 'MISSISSIPPI', abbreviation: 'MS'},
                { name: 'MISSOURI', abbreviation: 'MO'},
                { name: 'MONTANA', abbreviation: 'MT'},
                { name: 'NEBRASKA', abbreviation: 'NE'},
                { name: 'NEVADA', abbreviation: 'NV'},
                { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
                { name: 'NEW JERSEY', abbreviation: 'NJ'},
                { name: 'NEW MEXICO', abbreviation: 'NM'},
                { name: 'NEW YORK', abbreviation: 'NY'},
                { name: 'NORTH CAROLINA', abbreviation: 'NC'},
                { name: 'NORTH DAKOTA', abbreviation: 'ND'},
                { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
                { name: 'OHIO', abbreviation: 'OH'},
                { name: 'OKLAHOMA', abbreviation: 'OK'},
                { name: 'OREGON', abbreviation: 'OR'},
                { name: 'PALAU', abbreviation: 'PW'},
                { name: 'PENNSYLVANIA', abbreviation: 'PA'},
                { name: 'PUERTO RICO', abbreviation: 'PR'},
                { name: 'RHODE ISLAND', abbreviation: 'RI'},
                { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
                { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
                { name: 'TENNESSEE', abbreviation: 'TN'},
                { name: 'TEXAS', abbreviation: 'TX'},
                { name: 'UTAH', abbreviation: 'UT'},
                { name: 'VERMONT', abbreviation: 'VT'},
                { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
                { name: 'VIRGINIA', abbreviation: 'VA'},
                { name: 'WASHINGTON', abbreviation: 'WA'},
                { name: 'WEST VIRGINIA', abbreviation: 'WV'},
                { name: 'WISCONSIN', abbreviation: 'WI'},
                { name: '', abbreviation: ''},
                { name: 'WYOMING', abbreviation: 'WY' }
            ];

function validateMemberID(req,res) {
	var memberID=req.param('Membership ID');
	if(!memberID.match(pattern)) {
		console.log('Inside member Id validation');
		res.render('../views/error', {error: {"message": "Membership ID is improper."}});
		return false;
	}
	return true;
}

function validateStates(req) {
	for (var key in usStates) {
	var val = usStates[key];
	var state= req.param('State');
	var state1= state.toUpperCase();
	if((state1 === val.name) || state1 === val.abbreviation) {
	console.log("..matched " + state);
	return true;
	}
	}
	return false;
	}

function validatePassword(req,res) {
	var pwd=req.param('Password');
	var confpwd=req.param('Password confirmation');
	if(pwd===confpwd) {
		console.log('password matched');
		//res.render('../views/error', {error: {"message": "Membership ID is improper."}});
		return true;
	}
	console.log('password different');
	return false;
}

module.exports.validatePassword = validatePassword;
module.exports.validateMemberID = validateMemberID;
module.exports.validateStates = validateStates;
