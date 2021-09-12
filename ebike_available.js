/* Where is the closest ebike to my location?
 *
*/

// Citi Bike Endpoint URL Building
const citibikeEndpointUrl = 'http://gbfs.citibikenyc.com/gbfs'
const languageCode = 'en'
const stationInformationResource = 'station_information';
const stationStatusResource = 'station_status';
const buildCitiBikeUrl = (resource) => `${citibikeEndpointUrl}/${languageCode}/${resource}.json`;

// Fetch URL Resource
const fetch = async (url) => await new Request(url).loadJSON();
const fetchStation = async (resource) => (await fetch(buildCitiBikeUrl(resource))).data.stations;

const fetchStationsInformation = async () => fetchStation(stationInformationResource);
const fetchStationsStatus = async () => fetchStation(stationStatusResource);



// Main Application Code

const absoluteDistance = 0.00003;

let lat, lon;
[lat, lon] = args.shortcutParameter;

const stationsInformation = await fetchStationsInformation();
stations = stationsInformation.map(s => { return {
  name: s.name,
  id: s.station_id,
  lat: s.lat,
  lon: s.lon,
  delta: (s.lat - lat) ** 2 + (s.lon - lon) ** 2 };
});

stations = stations.filter(s => s.delta <= absoluteDistance);

ids = stations.map(s => s.id);

const stationsStatus = await fetchStationsStatus();
ebikes = stationsStatus.filter(s => ids.includes(s.station_id)).map(s => { return {
  id: s.station_id,
  ebikes: s.num_ebikes_available,
  bikes: s.num_bikes_available };
});

stations = stations.map(s => {
  const b = ebikes.filter(e => e.id == s.id)[0];
  return { ...s, ...b };
});

stations.sort((a, b) => a.delta - b.delta);
stations.filter(s => s.ebikes).map(s => console.log(s));

const ebikeFormat = (station) => `${station.name} - ${station.ebikes} e-bikes`;
const bikeFormat = (station) => `${station.name} - ${station.bikes} bikes`;

const ebikeMessages = stations.filter(s => s.ebikes).map(s => ebikeFormat(s));
const bikeMessages = stations.filter(s => !s.ebikes && s.bikes).map(s => bikeFormat(s));

Script.setShortcutOutput(ebikeMessages.concat(bikeMessages).slice(0, 5));
