/* https://github.com/8888/citibike-status
 * Citi Bike dock availability with JavaScript ES6 and [Scriptable](https://scriptable.app/).
 * This script queries Citi Bike's public APIs to output stations which have docks available.
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

const STATIONS = {
  '347': {
    name: 'Greenwich St & W Houston St',
    customName: 'Greenwich',
    priority: 1,
  },
  '3256': {
    name: 'Pier 40 - Hudson River Park',
    customName: 'Pier 40',
    priority: 2,
  },
  '128': {
    name: 'MacDougal St & Prince St',
    customName: 'Macdougal',
    priority: 3,
  },
  '3746': {
    name: '6 Ave & Broome St',
    customName: 'Broome',
    priority: 4,
  },
};

const createStationIdList = (stations) => {
  return Object.keys(stations);
}

const filterStations = (allStations, neededStationsIds) => {
  return allStations.filter(station => neededStationsIds.includes(station.station_id))
}

const buildReport = (stations, status) => {
  return status.map(station => {
    return {...STATIONS[station.station_id], ...station};
  });
}

const prioritize = (status) => {
  return status.sort((a, b) => a.priority - b.priority);
}

const buildMessage = (status) => {
  let message = 'Bike Update!';
  status.forEach(station => {
    message += ` At ${station.customName} there are ${station.num_docks_available} docks.`
  });
  return message;
}

const allStatus = await fetchStationsStatus();
const stationIds = createStationIdList(STATIONS);
const filteredStations = filterStations(allStatus, stationIds);
const report = buildReport(STATIONS, filteredStations);
const sortedReport = prioritize(report);
const message = buildMessage(sortedReport);

console.log(message)
//Script.setShortcutOutput(message);
