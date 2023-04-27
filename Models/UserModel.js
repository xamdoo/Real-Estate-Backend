const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
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
    confirmPassword: {
        type: String,
        required: true
    },
    phone: Number,
    address: String,
    file: String,
    savedProperties:  [{
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'propertyModel',
            required: true
        },
    }],
    is_agent: {
        type: Boolean, 
        default: false,
        required: true
    },
    viewedProperties:  [{
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'propertyModel',
            required: true
        },
        viewedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
},{
    timestamps: true
})


module.exports = mongoose.model('User', UserSchema)
