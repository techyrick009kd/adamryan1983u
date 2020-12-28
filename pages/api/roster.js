import { connectToDatabase } from "@lib/mongodb";


const getRoster = async (req, res, division) => {
  const { db } = await connectToDatabase();
  const collectionName = division + '-roster'

  const roster = await db
    .collection('timbits')
    .find({})
    .toArray();

  res.json(roster);
	};
export default getRoster;