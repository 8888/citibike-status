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

// Constant Station Information
const LEE_STATIONS = {
  '347': {
    name: 'Greenwich St & W Houston St',
    displayName: 'Greenwich',
    priority: 1,
  },
  '3256': {
    name: 'Pier 40 - Hudson River Park',
    displayName: 'Pier 40',
    priority: 2,
  },
  '128': {
    name: 'MacDougal St & Prince St',
    displayName: 'Macdougal',
    priority: 3,
  },
  '3746': {
    name: '6 Ave & Broome St',
    displayName: 'Broome',
    priority: 4,
  },
};

// Application Support Functions
const stationIds = (stations) => Object.keys(stations);

const filterStations = (stations, ids) => stations.filter(station => ids.includes(station.station_id))

const buildStationStatus = (stations) =>
  stations.map(station => {
    const lee = LEE_STATIONS[station.station_id];
    return {
      displayName: lee.displayName,
      dockCount: station.num_docks_available,
      priority: lee.priority
    };
  });

const sortByPriority = (stations) => stations.sort((a, b) => a.priority - b.priority);

const buildMessage = (stations) => {
  const introduction = 'Bike Update!';
  const stationInfo = stations.map(station => `${station.displayName} has ${station.dockCount} docks.`)
  return `${introduction} ${stationInfo.join(' ')}`;
}

// Main Application Code
const ids = stationIds(LEE_STATIONS);
const allStationStatus = await fetchStationsStatus();
const stations = filterStations(allStationStatus, ids);

const stationsReport = buildStationStatus(stations);
const sortedReport = sortByPriority(stationsReport);
const message = buildMessage(sortedReport);

Script.setShortcutOutput(message);
