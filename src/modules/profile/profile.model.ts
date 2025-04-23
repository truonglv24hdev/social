import mongoose from "mongoose";
import { IProfile } from "./profile.interface";

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  status: {
    type: String,
    require: true,
  },
  skills: {
    type: [],
  },
  bio: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        require: true,
      },
      company: {
        type: String,
        require: true,
      },
      location: {
        type: String,
        require: true,
      },
      form: {
        type: Date,
        require: true,
      },
      to: {
        type: Date,
        require: true,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        require: true,
      },
      degree: {
        type: String,
        require: true,
      },
      form: {
        type: Date,
        require: true,
      },
      to: {
        type: Date,
        require: true,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
  },
});

export default mongoose.model<IProfile & mongoose.Document>('profiles',ProfileSchema)
