// user fields
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 12;
const NAME_MAX_LENGTH = 45;
const SURNAME_MAX_LENGTH = 45;
const DENTISTID_MAX_LENGTH = 45;

// RTCPeerConnection Configuration Object
const RTC_CONFIG = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};

// Backend Streaming URL
const URL_BACKEND_STREAMING = "http://localhost:3001";

// socket reconnection
const SOCKET_RECONNECTION_ATTEMPTS = 2;
const SOCKET_RECONNECTION_DELAY = 1500; //milliseconds

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
            PD: { mesial: 1, middle: 2, distal: 3 },
            RE: { mesial: 2, middle: 1, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 2, distal: 1 },
            RE: { mesial: 2, middle: 1, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 7,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 6,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 5,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 4,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 3,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 2,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 1,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
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
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 2,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 3,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 4,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 5,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 6,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 7,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 8,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
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
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 2,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 3,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 4,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 5,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 6,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 7,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 8,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 0, middle: 1, distal: 2 },
            RE: { mesial: 4, middle: 3, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 0, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 1, distal: 3 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
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
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 7,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 6,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 5,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 4,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 3,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 2,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
      },
      {
        ID: 1,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
          {
            side: "lingual",
            PD: { mesial: 1, middle: 1, distal: 1 },
            RE: { mesial: 2, middle: 2, distal: 2 },
            BOP: { mesial: false, middle: true, distal: false },
          },
        ],
        MO: 3,
        MGJ: 4,
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
  RTC_CONFIG,
  URL_BACKEND_STREAMING,
  SOCKET_RECONNECTION_ATTEMPTS,
  SOCKET_RECONNECTION_DELAY,
  EX_DATA,
};
