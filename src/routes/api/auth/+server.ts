import type {RequestHandler} from "@sveltejs/kit";
import {json} from "@sveltejs/kit";
import {TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, DB_URI} from "$env/static/private";
import {PUBLIC_BASE_URL, PUBLIC_IMAGE_URL_PREFIX, PUBLIC_IMAGE_URL_SUFFIX} from "$env/static/public";
import {MongoClient} from "mongodb";
import type {Game} from "../../../lib/interfaces/Game";

export const GET: RequestHandler = async ({locals}) => {
    try {
        const client = new MongoClient(DB_URI);
        const db = client.db("GGr");

        const authRes = await fetch("https://id.twitch.tv/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                grant_type: "client_credentials",
            })
        })

        const token = (await authRes.json())?.access_token;
        let page = 0;
        const startingPage = 0;
        const pages = 8;
        const limit = 500;

        if (!token) {
            throw "Not authenticated";
        }
        console.log("Starting...");
        while ((startingPage + page) < pages) {
            const games: any[] = await fetchGames(token, limit, page, startingPage)
            if (!games) {
                throw `Bad response | page: ${page}`
            }
            if (!games.length) {
                console.log(`Reached the end at page ${startingPage + page}`);
                break;
            }
            for (let i = 0; i < games.length; i++) {
                const game = games[i];
                if (!game.cover?.image_id) {
                    console.log(`game ${game.id} has no valid image`);
                    continue;
                }
                const doc: Game = {
                    _id: game.id,
                    name: game.name,
                    releaseDateTs: game.first_release_date,
                    imageUrl: `${PUBLIC_IMAGE_URL_PREFIX}${game.cover.image_id}${PUBLIC_IMAGE_URL_SUFFIX}`,
                }

                for (const involved of game.involved_companies || []) {
                    if (!involved.company?.name) {
                        continue;
                    }
                    if (involved.publisher) {
                        doc.publisher = involved.company.name;
                    }
                    if (involved.developer) {
                        doc.developer = involved.company.name;
                    }
                }
                doc.genres = game.genres?.map((genre: { id: number, name: string }) => genre.name);

                try {
                    await db.collection("games")
                        .updateOne({_id: doc._id}, {$set: doc}, {upsert: true});

                    console.log(`${(i + 1) + (page * limit)}/${games.length * (pages - startingPage)}: ${game.id}`);
                } catch (e) {
                    console.log(`game ${game.id} not inserted`, e);
                }
            }

            page++;
        }
    } catch (e) {
        console.error(e);
    }


    return json({});
}

const fetchGames = async (token: string, limit: number = 100, page: number = 0, startingPage: number = 0) => {
    return;
    const gameRes = await fetch(`${PUBLIC_BASE_URL}/games`, {
        method: "POST",
        headers: {
            "Client-ID": TWITCH_CLIENT_ID,
            "Authorization": `Bearer ${token}`
        },
        body: `     
limit ${limit};
offset ${(page + startingPage) * limit};
sort total_rating;
where 
    category = 0 
    & total_rating > 30 
    & total_rating_count > 7 & total_rating_count < 11
    & themes != (42)
;
fields 
    name,
    total_rating,
    total_rating_count,
    cover.image_id,
    first_release_date,
    involved_companies.company.name,
    involved_companies.developer,
    involved_companies.publisher,
    genres.name
;
        `
    })

    const data = await gameRes.json();
    if (gameRes.status !== 200) {
        console.log(data);
        return;
    }

    console.log(`${page + 1}: fetched ${limit * (page + 1)} games (${data.length})`);

    return data;
}
