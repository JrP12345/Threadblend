import mongoose from 'mongoose';

export const connectDB = () => {
  const atlasConnectionUri = 'mongodb+srv://Threadblend:Jp12345@cluster0.fbityci.mongodb.net/';

  mongoose
    .connect(atlasConnectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB Atlas:', error.message);
    });
};
