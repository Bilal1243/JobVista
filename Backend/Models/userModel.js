import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
    },
    title: {
      type: String,
      required: true
    },
    industryType: {
      type: mongoose.Schema.ObjectId,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    education: {
      type: String
    },
    password: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profileImg: {
      type: String,
    },
    roles: { type: [String], default: ['user'] },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Users = mongoose.model("User", userSchema);
export default Users;