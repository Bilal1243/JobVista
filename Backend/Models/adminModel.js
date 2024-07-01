import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: { type: [String], default: ['admin'] },
  },
  {
    timestamps: true, // This will automatically add timestamps for any operations done.
  }
);

adminSchema.methods.matchPassword = async function (enteredPassword) {
  const pass =  await bcrypt.compare(enteredPassword, this.password);
  return pass
};

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;