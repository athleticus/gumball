var ref = require('reflektorjs');

ids = {
	'64217f0200000000': 'Ben',
	'42d6c3a00000000': 'Lucas',
	'446779900000000': 'Matt'
};

ref.on('hide', function(id){
	if(ids[id]){
		console.log("Hello, " + ids[id]);
	} else {
		console.log("Unknown user: " + id);
	}
});
