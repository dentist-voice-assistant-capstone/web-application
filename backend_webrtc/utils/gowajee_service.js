const decoder = require('../pbs/decoder_type_pb');
const encoder = require('../pbs/audio_pb');

const RATE = 48000 
function init_streaming_request() {
    // Gowajee API
    // Initialize Transcribe Config for API (set to default)
    transcribeConfig = {
        // language_code: "th-TH",
        decoder_type: decoder.DecoderType.LMBEAMSEARCH,
        get_word_timestamps: true,
        get_speaking_rate: false,
        word_list: ["พีดีอาร์อี", "มิซซิ่ง", "เอ็มโอ", "ดิสทรัล", "เอ็มจีเจ", "บัคคัล"] // ["พีดีอาร์อี", "บีโอพี", "มิซซิ่ง", "เอ็มโอ"], //"บัคคัล", "ลิงกัว"
    };

    // Initialize Streaming Config for API (set to default)
    streamingConfig = {
        transcribe_config: transcribeConfig,
        encoding: encoder.AudioEncoding.LINEAR_PCM,
        sample_rate: RATE,
        num_channels: 0,
    };

    // Create request and set streaming config
    request = {
        streaming_config: streamingConfig,
        audio_data: null,
        is_final: true,
    };
    return request;
}

function init_ner_request() {
    ner_request = {
        results : null,
        is_final : null,
        add_missing : {
            first_zee : 100,
            second_zee : 100,
        },
        undo_missing : {
            first_zee : 100,
            second_zee : 100,
        },
        version : "",
        duration : 0.0,
    };

    return ner_request
}

module.exports = { init_streaming_request, init_ner_request };