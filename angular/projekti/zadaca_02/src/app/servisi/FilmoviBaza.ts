export interface FilmoviBaza {
    id : number,
    naziv_filma : string,
    datum_unosa : Date,
    datum_premijere : Date,
    trajanje : number,
    radnja : string,
    ocjena : number,
    budzet : number,
    prihod : number,
    za_odrase : boolean,
    status : string,
    poster_putanja : string,
    izvorni_jezik : string,
    odobren : boolean,
    tagline : string,
    korisnik_id : number
}