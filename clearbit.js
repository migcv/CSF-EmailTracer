var Client   = require('clearbit').Client;
var clearbit = new Client({key: 'sk_d369f67048c0b1da11ab6e9c6b306a9b'});
var Person = clearbit.Person;
Person.find({email: 'jcm@inesc-id.pt'})
  .then(function (person) {
		console.log('Full Name: ', person.name.fullName);
    console.log('Given Name: ', person.name.givenName);
    console.log('Family Name: ', person.name.familyName);
    console.log('Gender: ', person.gender);
    console.log('About me handle: ', person.aboutme.handle);
    console.log('Bio: ', person.facebook.handle);
    console.log('Github: ', person.github.handle);
})
.catch(Person.QueuedError, function (err) {
	console.log(err); // Person is queued
})
.catch(Person.NotFoundError, function (err) {
	console.log(err); // Person could not be found
})
.catch(function (err) {
	console.log('Bad/invalid request, unauthorized, Clearbit error, or failed request');
});
