export default function declination(number, words) {
    // words: 0 фильмов, 1 фильма, 2 фильма
    const w = words, //.split('|'),
        n = Math.abs(number * 1);

    return n % 10 === 1 && n % 100 !== 11
        ? w[0]
        : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
                ? w[1]
                : w[2]
        );
};