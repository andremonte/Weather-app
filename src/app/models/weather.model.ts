export class Weather {

  constructor
  (
    public city_name?: number,
    public country?: string,
    public current_local_date?: Date,
    public icon?: string,
    public short_climate_desc?: string,
    public detail_climate_desc?: string,
    public temperature?: number,
    public wind_speed?: number,
    public wind_direction?: string,
    public humidity?: number,
    public feels_like?: number,
    public pressure?: number,
    public min?: number,
    public max?: number,
    public visibility?: number,
    public sunrise?: Date,
    public sunset?: Date,

    ) { }
}
