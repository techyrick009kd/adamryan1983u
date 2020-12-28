import { connectToDatabase } from "@lib/mongodb";

const getSchedule = async (req, res) => {
  const { db } = await connectToDatabase();
  let division = timbits
  const collectionName = division + '-schedule'

  const schedule = await db
    .collection(collectionName)
    .find({})
    .toArray();

  res.json(schedul);
	};
export default getSchedule;