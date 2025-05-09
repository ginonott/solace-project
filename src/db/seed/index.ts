import db from "..";
import { advocates } from "../schema";
import { advocateData } from "./advocates";

const seedAdvocateData = async () => {
  const data = await db.select().from(advocates).limit(1);
  if (data) {
    console.warn("advocate data is already seeded. Skipping.");
    return;
  }

  const records = await db.insert(advocates).values(advocateData).returning();
  console.log(`inserted ${records.length} advocates`);
};

export default (function seed() {
  return seedAdvocateData();
})()
  .then(() => {
    console.log("seeded the database");
    process.exit(0);
  })
  .catch((err) => {
    console.error(`could not seed advocate data: ${err}`);
    process.exit(1);
  });
