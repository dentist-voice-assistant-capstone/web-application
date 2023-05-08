// Backend Streaming URL
const URL_BACKEND = `https://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}`;
const URL_BACKEND_STREAMING = `https://${process.env.REACT_APP_BACKEND_STREAMING_IP}:${process.env.REACT_APP_BACKEND_STREAMING_PORT}`;

// user fields
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 12;
const NAME_MAX_LENGTH = 45;
const SURNAME_MAX_LENGTH = 45;
const DENTISTID_MAX_LENGTH = 45;

const PATIENTID_MAX_LENGTH = 45;

// RTCPeerConnection Configuration Object
const RTC_CONFIG = {
  iceServers: [
    {
      urls: "stun:a.relay.metered.ca:80",
    },
    {
      urls: "turn:a.relay.metered.ca:80",
      username: process.env.REACT_APP_OPEN_RELAY_USERNAME,
      credential: process.env.REACT_APP_OPEN_RELAY_CREDENTIAL,
    },
    {
      urls: "turn:a.relay.metered.ca:80?transport=tcp",
      username: process.env.REACT_APP_OPEN_RELAY_USERNAME,
      credential: process.env.REACT_APP_OPEN_RELAY_CREDENTIAL,
    },
    {
      urls: "turn:a.relay.metered.ca:443",
      username: process.env.REACT_APP_OPEN_RELAY_USERNAME,
      credential: process.env.REACT_APP_OPEN_RELAY_CREDENTIAL,
    },
    {
      urls: "turn:a.relay.metered.ca:443?transport=tcp",
      username: process.env.REACT_APP_OPEN_RELAY_USERNAME,
      credential: process.env.REACT_APP_OPEN_RELAY_CREDENTIAL,
    },
  ],
};

// socket reconnection
const SOCKET_RECONNECTION_ATTEMPTS = 5;
const SOCKET_RECONNECTION_DELAY = 500; //milliseconds

// Auto change Quadrant Delay
const AUTO_CHANGE_QUADRANT_DELAY = 1000; //milliseconds

// Update Record Interval
const UPDATE_RECORD_EVERY_MILLISECONDS = 10000 //milliseconds

const MAXIMUM_TIME_TO_RETRIEVE_FINISHED_RECORD = 24 * 60 * 60 * 1000 // 1 day in milliseconds

const EX_DATA = [
  {
    quadrant: 1,
    idxArray: [
      {
        ID: 8,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 7,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 6,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 5,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 4,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 3,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 2,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 1,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
    ],
  },

  {
    quadrant: 2,
    idxArray: [
      {
        ID: 1,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 2,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 3,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 4,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 5,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 6,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 7,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 8,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
    ],
  },
  {
    quadrant: 3,
    idxArray: [
      {
        ID: 1,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 2,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 3,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 4,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 5,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 6,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 7,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 8,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
    ],
  },
  {
    quadrant: 4,
    idxArray: [
      {
        ID: 8,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 7,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 6,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 5,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 4,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 3,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 2,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
      {
        ID: 1,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
          {
            side: "lingual",
            PD: { mesial: null, middle: null, distal: null },
            RE: { mesial: null, middle: null, distal: null },
            BOP: { mesial: null, middle: null, distal: null },
          },
        ],
        MO: null,
        MGJ: null,
      },
    ],
  },
];

export {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SURNAME_MAX_LENGTH,
  DENTISTID_MAX_LENGTH,
  PATIENTID_MAX_LENGTH,
  RTC_CONFIG,
  URL_BACKEND,
  URL_BACKEND_STREAMING,
  SOCKET_RECONNECTION_ATTEMPTS,
  SOCKET_RECONNECTION_DELAY,
  AUTO_CHANGE_QUADRANT_DELAY,
  UPDATE_RECORD_EVERY_MILLISECONDS,
  MAXIMUM_TIME_TO_RETRIEVE_FINISHED_RECORD,
  EX_DATA,
};
