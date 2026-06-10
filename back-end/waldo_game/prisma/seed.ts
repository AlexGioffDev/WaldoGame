import data from "../src/data/images.json" with {type: "json"}
import {prisma} from '../src/lib/prisma.js';

async function main()
{
    for(const [filename, imageData] of Object.entries(data))
    {
        const image = await prisma.image.create({
            data: {
                path: `${filename}.jpg`,
                name: imageData.name,
                author: imageData.author,
                width: imageData.width,
                height: imageData.height,
                characters: {
                    create: imageData.characters
                }
            }
        })
        console.log(`${image.name} created`)
    }
}

main().catch((err) => console.log('error')).finally(() => prisma.$disconnect());