/* Where are stations close to each other which
 * have differences in angle point rewards?
*/

// Citi Bike Endpoint URL Building
const bicyclesharingEndpointUrl = 'https://layer.bicyclesharing.net/map/v1';
const locationCode = 'nyc';
const stationResource = 'stations';
const buildBicycleSharingUrl = (resource) => `${bicyclesharingEndpointUrl}/${locationCode}/${resource}`;

// Fetch URL Resource
const fetch = async (url) => await new Request(url).loadJSON();
const fetchStationInfo = async (resource) => (await fetch(buildBicycleSharingUrl(resource))).features;

const fetchStations = async () => fetchStationInfo(stationResource);

const transformToStations = (data) => {
  const transformStation = (station) => {
    const s = station.properties;
    return {
      id: +s.station_id,
      name: s.name,
      lat: station.geometry.coordinates[0],
      lon: station.geometry.coordinates[1],
      bikes: s.bikes_available,
      points: s.bike_angels_points,
      // "give", "take", "neutral"
      action: s.bike_angels_action,
    }
  };

  return data.map(d => transformStation(d));
};

const absoluteDistance = 0.00003;
const stationsData = await fetchStations();
const stations = transformToStations(stationsData);

const needers = stations.filter(s => s.action == "give" && s.points == 4);
const neederIds = needers.map(s => s.id);
const takers = stations.filter(s => s.action != "give" && s.bikes);


let angelStations = needers.map(s => {
  let candidates = takers.map(c => {
    return {
      id: c.id,
      name: c.name,
      points: c.points,
      action: c.action,
      bikes: c.bikes,
      delta: (c.lat - s.lat) ** 2 + (c.lon - s.lon) ** 2
    }
  });

  candidates = candidates.filter(c => c.delta <= absoluteDistance);
  candidates = candidates.sort((a, b) => a.delta - b.delta);
  const angel = { ...s, delta: candidates?.[0]?.delta, stations: candidates };
  delete angel.lat;
  delete angel.lon;

  candidates.map(c => delete c.delta);
  return angel;
});

angelStations = angelStations.filter(s => s.stations.length);
angelStations = angelStations.sort((a, b) => a.delta - b.delta);
angelStations.map(s => delete s.delta);

const angelFormatted = (s) => `${s.name}: ${s.bikes} bikes, ${s.points} points`;
const candidateFormatted = (s) => `> ${s.name}: ${s.bikes} bikes`;
const messages = angelStations.map(s => [angelFormatted(s), ...s.stations.map(c => candidateFormatted(c))].join('\r\n'));
Script.setShortcutOutput(messages.join('\r\n\r\n'));
