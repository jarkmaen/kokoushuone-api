import "dotenv/config";

export const PORT = Number(process.env.PORT);

if (!PORT) {
    throw new Error("Ympäristömuuttuja PORT puuttuu .env tiedostosta");
}
