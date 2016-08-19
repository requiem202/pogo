var pogobuf = require('pogobuf'),
    sortBy = require('sort-array'),
    jsonfile = require('jsonfile'), 
    fs = require('fs'),
    readline = require('readline');

var login = new pogobuf.GoogleLogin(),
// login = new pogobuf.PTCLogin(),
    client = new pogobuf.Client(),
    count = 0,
    list = [],
    username,
    password;

rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question('Username: ', (answer) => {
    username = answer;

    rl.question('Password: ', (answer) => {
        password = answer;

        rl.close();

        var file = fs.createWriteStream(username+'.txt');



jsonfile.readFile('data.json', function(err, pokedex) {
//   console.dir(pokedex);
login.login(username, password)
.then(token => {
    client.setAuthInfo('google', token);
    // client.setAuthInfo('ptc', token);
    //client.setPosition(lat, lng);
    return client.init();
}).then(() => {
    // Make some API calls!
    return client.getInventory(0);
}).then(inventory => {
    // Use the returned data
    //console.log(inventory);
    for(var i = 0; i<inventory.inventory_delta.inventory_items.length; i++)
    {
        if (inventory.inventory_delta.inventory_items[i].inventory_item_data.pokemon_data != null) {
            // console.log(inventory.inventory_delta.inventory_items[i].inventory_item_data.pokemon_data);
            count++;
            //if (inventory.inventory_delta.inventory_items[i].inventory_item_data.pokemon_data.pokemon_id == 69){
            // if (inventory.inventory_delta.inventory_items[i].inventory_item_data.pokemon_data.cp == 638
            // || inventory.inventory_delta.inventory_items[i].inventory_item_data.pokemon_data.cp == 479){
            //     console.log(inventory.inventory_delta.inventory_items[i].inventory_item_data.pokemon_data);
            // }
            var name = '';
            var pokemon = inventory.inventory_delta.inventory_items[i].inventory_item_data.pokemon_data;
            var iv = Math.round(((pokemon.individual_attack + pokemon.individual_defense + pokemon.individual_stamina) / 45) *100);
            for (var j=0;j<pokedex.length;j++ ) {
                if (pokedex[j].Number == pokemon.pokemon_id) {
                    name = pokedex[j].Name;
                }
            }
            var result = {
                pokemon_id: pokemon.pokemon_id,
                name: name,
                cp: pokemon.cp,
                iv: iv,
            };
            list.push(result);
            // console.log(result);
        }
        // console.log(count);
    }
    sortBy(list, 'iv');
    console.log('Total: ' + count);

     for(var i = 0; i<list.length; i++)
     {
        console.log(list[i]);
        var pokemon = list[i];
        file.write('name: ' + pokemon.name + ', cp: ' + pokemon.cp + ', iv: ' + pokemon.iv + '\r\n');
     }
    // console.log(list);
    file.end();
});

});
    });

});