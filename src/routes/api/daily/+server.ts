import sharp from "sharp";
import {json} from "@sveltejs/kit";
import type {RequestHandler} from "@sveltejs/kit";
import {startingBlur} from "../../../lib/interfaces/Globals";

export const POST: RequestHandler = async ({locals}) => {
    const imageRes: ArrayBuffer = await (await fetch("https://upload.wikimedia.org/wikipedia/en/6/6a/Super_Mario_64_box_cover.jpg")).arrayBuffer();
    let imageSrc = (
        await sharp(Buffer.from(imageRes))
            .jpeg()
            .blur(startingBlur)
            .toBuffer()
    ).toString("base64");

    if (!imageSrc?.startsWith("data:image/jpeg;base64,")) {
        imageSrc = "data:image/jpeg;base64," + imageSrc;
    }

    return json(imageSrc);
}
