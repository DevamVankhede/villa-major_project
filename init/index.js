const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing=require('../models/listing.js');

async function main(){
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

main().then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
})

const initDB=async()=>{
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({...obj,owner:"67fb7cf431020fc6ba72e7f5"}))
await Listing.insertMany(initData.data);
console.log('Database initialized');
}




initDB();
