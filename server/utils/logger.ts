const error = (...params: unknown[]) => {
    console.error(...params);
};

const info = (...params: unknown[]) => {
    console.log(...params);
};

export { error, info };
