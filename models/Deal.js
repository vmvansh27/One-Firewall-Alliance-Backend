// src/models/Deal.js
import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    jobTitle: String,
    phone: String,
    customerName: String,
    mailingCountry: String,
    address: String,
    mailingCity: String,
    partnerSalesRep: String,
    partnerSE: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "approved", "denied"],
        default: "pending"  // ✅ Always new deals will start as "pending"
    }
});

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;
