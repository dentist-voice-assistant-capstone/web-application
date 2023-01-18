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
        ID: 1,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
        ID: 1,
        missing: false,
        depended_side_data: [
          {
            side: "buccal",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
          },
          {
            side: "lingual",
            PD: [null, null, null],
            RE: [null, null, null],
            BOP: [true, false, true],
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
  RTC_CONFIG,
  URL_BACKEND_STREAMING,
  SOCKET_RECONNECTION_ATTEMPTS,
  SOCKET_RECONNECTION_DELAY,
  EX_DATA,
};
