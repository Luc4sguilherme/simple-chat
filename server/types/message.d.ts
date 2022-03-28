import mongoose from 'mongoose';

export declare interface Message {
  text: string;
  user_id: string;
}

export declare interface MessageDoc extends Message, mongoose.Document {}
