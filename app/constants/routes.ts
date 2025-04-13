import { Traffic } from "~/types/traffic";

const OUTBOUND_CITY_LIMIT: Traffic.Point = [33.087033, -112.036442];
const OUTBOUND_I10: Traffic.Point = [33.255496, -111.948166];
const INBOUND_CITY_LIMIT: Traffic.Point = [33.087006, -112.0367];
const INBOUND_I10: Traffic.Point = [33.255604, -111.948299];

export const ROUTES = (
  [
    {
      key: "347",
      name: "City Limits",
      outbound: {
        description: "Maricopa to I-10",
        origin: OUTBOUND_CITY_LIMIT,
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Maricopa",
        origin: INBOUND_I10,
        destination: INBOUND_CITY_LIMIT,
      },
    },
    {
      key: "tortosa",
      name: "Tortosa",
      outbound: {
        description: "Tortosa to I-10",
        origin: [33.058148169311266, -111.9570060479114],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Tortosa",
        origin: INBOUND_I10,
        destination: [33.05801754333691, -111.95697985357468],
      },
    },
    {
      key: "sorrento",
      name: "Sorrento",
      outbound: {
        description: "Sorrento to I-10",
        origin: [33.04350740552472, -111.97052762471886],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Sorrento",
        origin: INBOUND_I10,
        destination: [33.04350740552472, -111.97052762471886],
      },
    },
    {
      key: "rancho-mirage",
      name: "Rancho Mirage",
      outbound: {
        description: "Rancho Mirage to I-10",
        origin: [33.05801232363343, -111.97121051519616],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Rancho Mirage",
        origin: INBOUND_I10,
        destination: [33.05801232363343, -111.97121051519616],
      },
    },
    {
      key: "desert-passage",
      name: "Desert Passage",
      outbound: {
        description: "Desert Passage to I-10",
        origin: [33.04813893774115, -112.00272551536138],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Desert Passage",
        origin: INBOUND_I10,
        destination: [33.04813893774115, -112.00272551536138],
      },
    },
    {
      key: "santa-rosa-springs",
      name: "Santa Rosa Springs",
      outbound: {
        description: "Santa Rosa to I-10",
        origin: [33.03314347537254, -112.01414595728316],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Santa Rosa",
        origin: INBOUND_I10,
        destination: [33.03314347537254, -112.01414595728316],
      },
    },
    {
      key: "santa-rosa-crossing",
      name: "Santa Rosa Crossing",
      outbound: {
        description: "Santa Rosa Crossing to I-10",
        origin: [33.04358979595355, -112.03788328397084],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Santa Rosa Crossing",
        origin: INBOUND_I10,
        destination: [33.04358979595355, -112.03788328397084],
      },
    },
    {
      key: "palo-brea",
      name: "Palo Brea",
      outbound: {
        description: "Palo Brea to I-10",
        origin: [33.0291406026865, -112.04472643860875],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Palo Brea",
        origin: INBOUND_I10,
        destination: [33.0291406026865, -112.04472643860875],
      },
    },
    {
      key: "alterra",
      name: "Alterra",
      outbound: {
        description: "Alterra to I-10",
        origin: [33.04380919986988, -112.05346462701979],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Alterra",
        origin: INBOUND_I10,
        destination: [33.04380919986988, -112.05346462701979],
      },
    },
    {
      key: "maricopa-meadows",
      name: "Maricopa Meadows",
      outbound: {
        description: "Maricopa Meadows to I-10",
        origin: [33.05388293102406, -112.0601994772794],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Maricopa Meadows",
        origin: INBOUND_I10,
        destination: [33.05388293102406, -112.0601994772794],
      },
    },
    {
      key: "senita",
      name: "Senita",
      outbound: {
        description: "Senita to I-10",
        origin: [33.056811643694004, -112.03635521490386],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Senita",
        origin: INBOUND_I10,
        destination: [33.056811643694004, -112.03635521490386],
      },
    },
    {
      key: "glennwilde",
      name: "Glennwilde",
      outbound: {
        description: "Glennwilde to I-10",
        origin: [33.054448786345596, -112.02094062267247],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Glennwilde",
        origin: INBOUND_I10,
        destination: [33.054448786345596, -112.02094062267247],
      },
    },
    {
      key: "homestead",
      name: "Homestead",
      outbound: {
        description: "Homestead to I-10",
        origin: [33.064679311457425, -112.00389577495008],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Homestead",
        origin: INBOUND_I10,
        destination: [33.064679311457425, -112.00389577495008],
      },
    },
    {
      key: "the-lakes-at-rancho",
      name: "The Lakes at Rancho El Dorado",
      outbound: {
        description: "The Lakes to I-10",
        origin: [33.075062522515054, -112.00449489272852],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to The Lakes",
        origin: INBOUND_I10,
        destination: [33.075062522515054, -112.00449489272852],
      },
    },
    {
      key: "province",
      name: "Province",
      outbound: {
        description: "Province to I-10",
        origin: [33.068461887130006, -112.02552642203277],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Province",
        origin: INBOUND_I10,
        destination: [33.068461887130006, -112.02552642203277],
      },
    },
    {
      key: "villages",
      name: "Villages at Rancho El Dorado",
      outbound: {
        description: "Villages to I-10",
        origin: [33.07067715772965, -112.03762162405454],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Villages",
        origin: INBOUND_I10,
        destination: [33.07067715772965, -112.03762162405454],
      },
    },
    {
      key: "acadia-crossings",
      name: "Acadia Crossings",
      outbound: {
        description: "Acadia Crossings to I-10",
        origin: [33.072363387106336, -112.05043925592928],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Acadia Crossings",
        origin: INBOUND_I10,
        destination: [33.072363387106336, -112.05043925592928],
      },
    },
    {
      key: "rancho-el-dorado",
      name: "Rancho El Dorado",
      outbound: {
        description: "Rancho El Dorado to I-10",
        origin: [33.08283761793592, -112.0360579090848],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Rancho El Dorado",
        origin: INBOUND_I10,
        destination: [33.08283761793592, -112.0360579090848],
      },
    },
    {
      key: "cobblestone",
      name: "Cobblestone",
      outbound: {
        description: "Cobblestone to I-10",
        origin: [33.08544280667428, -112.04236356946028],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Cobblestone",
        origin: INBOUND_I10,
        destination: [33.08544280667428, -112.04236356946028],
      },
    },
    {
      key: "moonlight-ridge",
      name: "Moonlight Ridge",
      outbound: {
        description: "Moonlight Ridge to I-10",
        origin: [33.07234140207875, -112.06999036498107],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Moonlight Ridge",
        origin: INBOUND_I10,
        destination: [33.07234140207875, -112.06999036498107],
      },
    },
    {
      key: "desert-cedars",
      name: "Desert Cedars",
      outbound: {
        description: "Desert Cedars to I-10",
        origin: [33.046647920558605, -112.04271085581105],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Desert Cedars",
        origin: INBOUND_I10,
        destination: [33.046647920558605, -112.04271085581105],
      },
    },
    {
      key: "amarillo-creek",
      name: "Amarillo Creek",
      outbound: {
        description: "Amarillo Creek to I-10",
        origin: [32.98504925441318, -112.07833455772573],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Amarillo Creek",
        origin: INBOUND_I10,
        destination: [32.98504925441318, -112.07833455772573],
      },
    },
    {
      key: "hidden-valley-papago-warren",
      name: "Hidden Valley - Papago & Warren",
      outbound: {
        description: "Hidden Valley to I-10",
        origin: [32.9854688291899, -112.13277240256399],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Hidden Valley",
        origin: INBOUND_I10,
        destination: [32.9854688291899, -112.13277240256399],
      },
    },
    {
      key: "hidden-valley-warren-century",
      name: "Hidden Valley - Warren & Century",
      outbound: {
        description: "Hidden Valley to I-10",
        origin: [32.898531091891726, -112.1346588011455],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Hidden Valley",
        origin: INBOUND_I10,
        destination: [32.898531091891726, -112.1346588011455],
      },
    },
    {
      key: "hidden-valley-ralston-robin",
      name: "Hidden Valley - Ralston & Robin",
      outbound: {
        description: "Hidden Valley to I-10",
        origin: [32.85496694864441, -112.11753941647807],
        destination: OUTBOUND_I10,
      },
      inbound: {
        description: "I-10 to Hidden Valley",
        origin: INBOUND_I10,
        destination: [32.85496694864441, -112.11753941647807],
      },
    },
  ] satisfies Traffic.RouteDefinition[]
).sort((a, b) => a.name.localeCompare(b.name));
