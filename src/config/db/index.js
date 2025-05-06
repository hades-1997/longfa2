import mongoose from 'mongoose';

async function connect () {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/longfa2');
        console.log("Connect success !!!")
    }catch (err) {
        console.log("Connect failure !!!")
    }

}

export default {connect};