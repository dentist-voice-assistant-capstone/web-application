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
        word_list: ["พีดีอาร์อี", "มิซซิ่ง", "เอ็มโอ", "ดิสทัล"] // ["พีดีอาร์อี", "บีโอพี", "มิซซิ่ง", "เอ็มโอ"], //"บัคคัล", "ลิงกัว"
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

module.exports = { init_streaming_request };