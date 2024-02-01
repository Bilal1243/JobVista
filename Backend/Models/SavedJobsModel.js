import mongoose from "mongoose";

const savedJobSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  savedItems: {
    type: Array
  }
}, {
  timestamps: true,
});

const SavedJobs = mongoose.model('SavedJobs', savedJobSchema);

export default SavedJobs;
