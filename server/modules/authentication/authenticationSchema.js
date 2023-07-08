import mongoose from 'mongoose';

const RegisterSchema = new mongoose.Schema({
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
    address: {
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

RegisterSchema.index({ email: 1 });
RegisterSchema.index({ userType: 1 });

export default mongoose.model('Users', RegisterSchema)
