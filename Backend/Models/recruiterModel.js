import mongoose from "mongoose";
import bcrypt from "bcrypt";

const recruiterSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true
    },
    industryType: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    education: {
      type: String,
      required: true
    },
    profileImg: {
      type: String
    },
    about: {
      type: String
    },
    password: {
      type: String,
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    roles: { type: [String], default: ['recruiter'] },
  },
  {
    timestamps: true,
  }
);

recruiterSchema.methods.matchPassword = async function (enteredPassword) {
  const pass = await bcrypt.compare(enteredPassword, this.password);
  return pass
};

recruiterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Recruiters = mongoose.model("Recruiters", recruiterSchema);
export default Recruiters;