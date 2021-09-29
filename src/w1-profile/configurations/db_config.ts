import mongoose from 'mongoose';

function databaseConnection() {
    mongoose.connect(process.env.DATABASE_URL as string)
    .then(() => console.log("Connecting in 5,4,3,3,1...."))
    .catch((err) => console.log(" Error Connecting to Database => ", err))
}

export default databaseConnection;