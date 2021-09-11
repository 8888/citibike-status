/* setup functions when adding new stations */

const fetchStationStatus = async (id) => {
  const url = 'http://gbfs.citibikenyc.com/gbfs/es/station_status.json';
  const r = new Request(url);
  const data = await r.loadJSON();
  const station = data.data.stations.find(station => station.station_id === id)
  console.log(station);
};

const fetchStationInformation = async (name) => {
  const url = 'http://gbfs.citibikenyc.com/gbfs/es/station_information.json';
  const r = new Request(url);
  const data = await r.loadJSON();
  const station = data.data.stations.find(station => station.name === name);
  //console.log(data.data.stations[0]);
  console.log(station);
};

/*
Sample output data structure 
{
"id":"347",
"name":"Greenwich St & W Houston St",
"num_docks_available":25,
"num_bikes_disabled":0,
"num_ebikes_available":0,
"num_docks_disabled":0,
"num_bikes_available":10,
"is_renting":1,
"is_returning":1,
"station_id":"347",
"is_installed":1,
"last_reported":1581169365,
"eightd_has_available_keys":false
}
*/

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

const fetchAllStationsStatus = async () => {
  const url = 'http://gbfs.citibikenyc.com/gbfs/es/station_status.json';
  const response = await new Request(url).loadJSON();
  return response.data.stations;
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

//fetchStationInformation(STATIONS['1'].name);

const allStatus = await fetchAllStationsStatus();
const stationIds = createStationIdList(STATIONS);
const filteredStations = filterStations(allStatus, stationIds);
const report = buildReport(STATIONS, filteredStations);
const sortedReport = prioritize(report);
const message = buildMessage(sortedReport);

console.log(message)
Script.setShortcutOutput(message);
