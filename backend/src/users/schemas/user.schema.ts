import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRole = 'admin' | 'user';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  // Never a `password` field — select:false so it's never returned by default,
  // and never touched by any pre-save hook (hashing happens only in AuthService).
  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, enum: ['admin', 'user'], default: 'user' })
  role: UserRole;

  @Prop({ default: [] })
  skills: string[];

  @Prop({ default: [] })
  experiences: Record<string, any>[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Second line of defense: even if select:false is bypassed somewhere,
// passwordHash never survives JSON serialization.
UserSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, any>) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});
