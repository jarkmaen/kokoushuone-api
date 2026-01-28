import "dotenv/config";

const PORT = Number(process.env.PORT);

if (!PORT) {
    throw new Error("Ympäristömuuttuja PORT puuttuu .env tiedostosta");
}

export { PORT };
