export const SETTINGS: Settings = {
  relays: {active: false, name: 'Relays'},
  lateBags: {active: false, name: 'Late Bags'},
  directs: {active: false, name: 'Directs'},
  tieOuts: {active: false, name: 'Tie Outs'},
  signature: {active: false, name: 'Signature'},
  nonSignature: {active: false, name: 'Non-Signature'},
  customsCOD: {active: false, name: 'Customs COD'},
  nonBarcoded: {active: false, name: 'Non-Barcoded'},
  cpu: {active: false, name: 'CPU'},
  cpu11To50: {active: false, name: 'CPU 11 to 50'},
  cpu51AndUp: {active: false, name: 'CPU 51 and Up'},
  slb: {active: false, name: 'SLB'},
  depotTransfers: {active: false, name: 'Depot Transfers'},
  rpoClears: {active: false, name: 'RPO Clears'},
  latePrios: {active: false, name: 'Late Prios'},
  slbExtractions: {active: false, name: 'SLB Extractions'},
  manAndVan: {active: false, name: 'Man and Van'},
  stationMain: {active: false, name: 'Station Main'},
  virl: {active: false, name: 'VIRL'},
  boxChecks: {active: false, name: 'Box Checks'},
  fedex: {active: false, name: 'Fedex'},
  redBags: {active: false, name: 'Red Bags'},
  ported: {active: false, name: 'Ported'},
  seaplane: {active: false, name: 'Seaplane'},
  bhv: {active: false, name: 'BHV'},
  mobiles: {active: false, name: 'Mobiles'},
  boeing: {active: false, name: 'Boeing'},
  overheadDoor: {active: false, name: 'Overhead Door'},
  wool: {active: false, name: 'Wool'},
  stationA: {active: false, name: 'Station A'},
  chHart: {active: false, name: 'CH Hart'},
  kimberley: {active: false, name: 'Kimberley'},
  viu: {active: false, name: 'VIU'},
  studentRes: {active: false, name: 'Student Res'},
  nrgh: {active: false, name: 'NRGH'},
  icbc: {active: false, name: 'ICBC'},
  ooa: {active: false, name: 'OOA'},
  sort: {active: false, name: 'Sort'},
  lateBagsAddTrip: {active: false, name: 'Late Bags Add Trip'},
  lateLateBags: {active: false, name: 'Late Late Bags'}
};

export interface Settings {
  [key: string]: Setting;
}

export interface Setting {
  id?: string;
  name: string;
  active: boolean;
}