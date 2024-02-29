const { program } = require('commander');

const appartments = require('./appartments');

const invokeAction = async ({action,id,picture,country,city,description,rating,price}) => {
    switch (action) {
        case "getAll":
            const allAppartments = await appartments.getAllAppartments();
            console.log(allAppartments);
            break;
        case "getById":
            const appartment = await appartments.getAppartmentById(id);
            console.log(appartment);
            break;
        case "create":
            const newAppartment = await appartments.addNewAppartment({picture, country, city, description, rating, price});
            console.log(newAppartment);
            break;
        case "update":
            const updatedAppartment = await appartments.updateAppartmentById(id, {picture, country, city, description, rating, price});
            console.log(updatedAppartment)
            break;
        case "remove":
            const removedAppartment = await appartments.deleteAppartmentByID(id);
            console.log(removedAppartment);
            break;
        default:
            console.log("Unknown action")
   }
}

// invokeAction({action:"remove",id:"h3kP7JwxnN44OE5hMbqQh"}).then(console.log).catch(console.error)

program
    .option("-a, --action <action>", "Action to invoke")
    .option("-i, --id <id>", "Appartment id")
    .option("-p, --picture <picture>", "Appartment foto")
    .option("-ctr, --country <country>", "Appartment location country")
    .option("-ct, --city <city>", "Appartment location city")
    .option("-d, --description <description>", "Description of appartment")
    .option("-r, --rating <rating>", "Appartment rating")
    .option("-pr, --price <price>", "Price per night")
    
program.parse(process.argv);
const options = program.opts();
invokeAction(options);