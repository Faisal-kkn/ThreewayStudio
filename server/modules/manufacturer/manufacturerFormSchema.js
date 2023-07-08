import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    OrderID: {
        type: String,
        required: true,
        unique: true,
        default: (() => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let code = '';

            for (let i = 0; i < 5; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }

            return code;
        })()
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        enum: ["1ton", "2ton", "3ton"],
        required: true,
    },
    pickupAddress: {
        type: String,
        required: true,
    },
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    status: {
        type: String,
        enum: ["REQUESTED", "ACCEPTED", "REJECTED", "DELIVERED"],
        required: true
    },
    price: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        default: Date.now
    },
});


export default mongoose.model("Order", orderSchema);
