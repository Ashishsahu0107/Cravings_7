import mongoose from "mongoose";

const RiderSchema = mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    vehicleDetails: {
      type: {
        vehicleType: { type: String, required: true },
        vehicleNumber: { type: String, required: true },
        vehicleModel: { type: String, required: true },
        vehicleColor: { type: String, required: true },
      },
    },
    documents: {
      type: {
        drivingLicense: { type: String, required: true },
        vehicleRegistrationCertificate: { type: String, required: true },
        insuranceCertificate: { type: String, required: true },
        aadharCard: { type: String, required: true },
        panCard: { type: String, required: true },
      },
    },
    currentAddress: {
      type: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true },
        country: { type: String, required: true },
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },
    averageRating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: false },
    financialDetails: {
      type: {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
        ifscCode: { type: String, required: true },
      },
    },
    currentLocation: {
      type: {
        lat: { type: String },
        lon: { type: String },
      },
    },
    walletBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    deliveriesCompleted: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 100 },
    completionRate: { type: Number, default: 100 },
    onlineStatus: {
      type: String,
      enum: ["online", "offline", "busy", "on_delivery"],
      default: "offline",
    },
    activeHoursToday: { type: Number, default: 0 },
    lastOnlineAt: { type: Date },
  },
  { timestamps: true },
);

const Rider = mongoose.model("rider", RiderSchema);

const RiderEarningsSchema = mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    deliveryFee: { type: Number, default: 0 },
    tips: { type: Number, default: 0 },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netEarnings: { type: Number, default: 0 },
    deliveryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const RiderEarnings = mongoose.model("riderEarnings", RiderEarningsSchema);

const RiderTransactionSchema = mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: false,
    },
    type: {
      type: String,
      enum: ["delivery_fee", "tip", "bonus", "withdrawal", "deduction"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "reversed"],
      default: "completed",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const RiderTransaction = mongoose.model("riderTransaction", RiderTransactionSchema);

export default Rider;
export { RiderEarnings, RiderTransaction };
