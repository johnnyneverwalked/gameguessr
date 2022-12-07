import type {PageServerLoad} from "../../.svelte-kit/types/src/routes/$types";
import {MongoClient} from "mongodb";
import {DB_URI} from "$env/static/private";
import dayjs from "dayjs";
import {json} from "@sveltejs/kit";
import seedrandom from "seedrandom";

export const load: PageServerLoad<{}> = async ({locals, url}) => {
    try {
        const client = new MongoClient(DB_URI);
        const db = client.db("GGr");

        const [range, dailies] = await Promise.all([
            db.collection("games").countDocuments(),
            db.collection("dailies").find({}, {projection: {index: 1}}).toArray()
        ]);
        const past: number[] = dailies?.map(d => d.index);
        const seed: string = dayjs().startOf("day").unix().toString();
        const rng = seedrandom(seed);

        let index: number = Math.floor(rng() * range);
        while (past.includes(index)) {
            index = Math.floor(rng() * range);
        }

        const game = (await db.collection("games")
            .find()
            .sort({_id: 1})
            .skip(index)
            .limit(1)
            .toArray())[0]
        console.log({range, seed, index, game});
        return json({range, seed, index, game})

    } catch (e) {

    }
    return {}
}
