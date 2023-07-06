import mongoose from 'mongoose';

let RegisterSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    // otp: {
    //     type: String,
    //     required: false
    // },
    // otpStatus: {
    //     type: Boolean,
    //     default: false
    // },
    created: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model('users', RegisterSchema)
