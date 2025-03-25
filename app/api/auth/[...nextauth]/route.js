"use strict";

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB();

        // store the user id from MongoDB to session
        const sessionUser = await User.findOne({ email: session.user.email });

        if (!sessionUser) return session; // Avoid crash if user is not found

        session.user.id = sessionUser._id.toString();
      } catch (error) {
        console.error("Error fetching user in session:", error);
      }

      return session;
    },
    async signIn({ account, profile }) {
      try {
        await connectToDB();

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s+/g, "").toLowerCase(), // Replace spaces more efficiently
            image: profile.image, // Ensure correct property
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking if user exists:", error);
        return false;
      }
    },
  }
});

export { handler as GET, handler as POST };
