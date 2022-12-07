
export interface Game {
    _id: number;
    name: string;
    releaseDateTs: number;
    imageUrl: string;
    developer?: string;
    publisher?: string;
    genres?: string[]
}
